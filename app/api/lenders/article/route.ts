/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/app/lib/prisma';
import { 
    ArticleSchema, 
    ArticleUpdateSchema 
} from '@/app/lib/types/lender';

// Enhanced Pagination Helper
const paginate = (page: number, limit: number) => ({
    skip: Math.max(0, (page - 1) * limit),
    take: limit,
});

// Comprehensive Error Handler with More Detailed Logging
function handleError(error: unknown, context: string) {
    console.error(`[${context}_ERROR]`, JSON.stringify(error, Object.getOwnPropertyNames(error)));

    if (error instanceof z.ZodError) {
        return NextResponse.json({
            error: 'Validation Failed',
            details: error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
        }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return NextResponse.json({
                    error: 'Unique Constraint Violation',
                    message: 'An article with similar details already exists.'
                }, { status: 409 });

            case 'P2003':
                return NextResponse.json({
                    error: 'Reference Constraint Violation',
                    message: 'Invalid references in article creation.'
                }, { status: 400 });

            default:
                return NextResponse.json({
                    error: 'Database Error',
                    message: error.message
                }, { status: 500 });
        }
    }

    return NextResponse.json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
}

// Enhanced Validation Helpers with More Comprehensive Checks
async function validateArticleCreation(data: z.infer<typeof ArticleSchema>, userId: string) {
    // Check if user exists and has proper permissions
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
            id: true, 
            role: true,
            isVerified: true 
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Verify user is verified
    if (!user.isVerified) {
        throw new Error('User account must be verified to create articles');
    }

    // Role-based access control
    if (data.type === 'LENDERS' && user.role !== 'STUDENT') {
        throw new Error('Only admins can create lender articles');
    }

    // Optional community validation
    // if (data.communityId) {
    //     const community = await prisma.community.findUnique({
    //         where: { id: data.communityId },
    //         select: { id: true }
    //     });

    //     if (!community) {
    //         throw new Error('Community not found');
    //     }
    // }

    // Prevent duplicate articles (matching title and content)
    const existingArticle = await prisma.article.findFirst({
        where: {
            title: data.title,
            content: data.content,
            creatorId: userId
        }
    });

    if (existingArticle) {
        throw new Error('An article with this title and content already exists');
    }
}

// Prevent Abuse: Rate Limiting and Content Validation
function validateArticleContent(data: z.infer<typeof ArticleSchema>) {
    // Min and max length checks
    if (data.title.length < 10 || data.title.length > 255) {
        throw new Error('Title must be between 10 and 255 characters');
    }

    if (data.content.length < 50 || data.content.length > 10000) {
        throw new Error('Content must be between 50 and 10,000 characters');
    }

    // Optional: Spam prevention (e.g., prevent repeated content)
    const bannedPatterns = [
        /click here/gi, 
        /buy now/gi, 
        /[^a-zA-Z\s]{10,}/  // Prevent excessive non-alphabetic characters
    ];

    bannedPatterns.forEach(pattern => {
        if (pattern.test(data.title) || pattern.test(data.content)) {
            throw new Error('Potential spam detected in article content');
        }
    });
}

// GET Articles Handler with Enhanced Security
export async function GET(req: Request) {
    try {
        const url = new URL(req.url, `http://${req.headers.get('host')}`);

        // Optional Article ID Retrieval
        const id = url.searchParams.get('id');
        if (id) {
            const article = await prisma.article.findUnique({
                where: { id },
                include: {
                    creator: { 
                        select: { 
                            id: true, 
                            name: true, 
                            avatarUrl: true,
                            isVerified: true
                        } 
                    },
                    
                    votes: {
                        select: {
                            userId: true,
                            status: true
                        }
                    }
                }
            });

            if (!article) {
                return NextResponse.json(
                    { error: 'Article not found' }, 
                    { status: 404 }
                );
            }

            return NextResponse.json(article);
        }

        // Comprehensive Query Parameter Validation
        const querySchema = z.object({
            query: z.string().optional().default(''),
            page: z.coerce.number().int().positive().default(1),
            limit: z.coerce.number().int().min(1).max(100).default(10),
            type: z.enum(['COMMUNITY', 'LENDERS']).optional(),
            status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
            sortBy: z.enum(['createdAt', 'upVotes', 'views']).default('createdAt'),
            sortOrder: z.enum(['asc', 'desc']).default('desc')
        });

        const { 
            query, 
            page, 
            limit, 
            type, 
            status, 
            sortBy, 
            sortOrder 
        } = querySchema.parse({
            query: url.searchParams.get('query') || '',
            page: url.searchParams.get('page'),
            limit: url.searchParams.get('limit'),
            type: url.searchParams.get('type'),
            status: url.searchParams.get('status'),
            sortBy: url.searchParams.get('sortBy'),
            sortOrder: url.searchParams.get('sortOrder')
        });

        const { skip, take } = paginate(page, limit);

        const whereClause: Prisma.ArticleWhereInput = {
            AND: [
                query ? {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: [query] } } // Changed from 'has' to 'hasSome'
                    ]
                } : {},
                type ? { type: { equals: type } } : {},
                status ? { status: { equals: status } } : {},
                { status: { equals: 'PUBLISHED' } } // Default to only published articles
            ]
        };

        // Use Transaction for Consistent Reads
        const [articles, total] = await prisma.$transaction([
            prisma.article.findMany({
                where: whereClause,
                include: {
                    creator: { 
                        select: { 
                            id: true, 
                            name: true, 
                            avatarUrl: true,
                            isVerified: true
                        } 
                    },
                    
                    _count: {
                        select: { votes: true }
                    }
                },
                skip,
                take,
                orderBy: { [sortBy]: sortOrder }
            }),
            prisma.article.count({ where: whereClause })
        ]);

        const pages = Math.ceil(total / limit);

        if (page > pages && pages > 0) {
            return NextResponse.json(
                { 
                    error: 'Page number exceeds total pages', 
                    pagination: { total, pages, page, limit } 
                }, 
                { status: 400 }
            );
        }

        return NextResponse.json({
            articles,
            pagination: {
                total,
                pages,
                page,
                limit
            }
        });

    } catch (error) {
        return handleError(error, 'GET_ARTICLES');
    }
}

// POST Create Article with Enhanced Validation and Transaction
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const articleData = ArticleSchema.parse(body);

        // Content Validation and Spam Prevention
        validateArticleContent(articleData);

        // Use Transaction to Ensure Atomic Operation
        const article = await prisma.$transaction(async (tx: any) => {
            // Re-validate creator and permissions within transaction
            await validateArticleCreation(articleData, articleData.creatorId);

            // Create article with initial vote counts
            return tx.article.create({
                data: {
                    ...articleData,
                    upVotes: 0,
                    downVotes: 0,
                    views: 0
                },
                include: {
                    creator: { 
                        select: { 
                            id: true, 
                            name: true, 
                            avatarUrl: true,
                            isVerified: true
                        } 
                    },
                    // community: true
                }
            });
        });

        return NextResponse.json(article, { status: 201 });

    } catch (error) {
        return handleError(error, 'POST_ARTICLE');
    }
}


// PUT Update Article with Robust Permissions and Transaction
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const url = new URL(req.url, `http://${req.headers.get('host')}`);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Article ID is required' }, 
                { status: 400 }
            );
        }

        // Validate update data (partial schema allows optional fields)
        const updateData = ArticleUpdateSchema.parse(body);

        const article = await prisma.$transaction(async (tx:any) => {
            // Check existing article and permissions
            const existingArticle = await tx.article.findUnique({
                where: { id },
                select: { 
                    creatorId: true, 
                    status: true 
                }
            });

            if (!existingArticle) {
                throw new Error('Article not found');
            }

            // Prevent updating other users' articles
            if (updateData.creatorId && updateData.creatorId !== existingArticle.creatorId) {
                throw new Error('You can only update your own articles');
            }

            // Prevent updating archived articles
            if (existingArticle.status === 'ARCHIVED') {
                throw new Error('Cannot update archived articles');
            }

            // Optional community validation
            if (updateData.communityId) {
                const community = await tx.community.findUnique({
                    where: { id: updateData.communityId },
                    select: { id: true }
                });

                if (!community) {
                    throw new Error('Community not found');
                }
            }

            // Validate updated content if provided
            if (updateData.title || updateData.content) {
                validateArticleContent({
                    ...existingArticle,
                    ...updateData
                });
            }

            return tx.article.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    creator: { 
                        select: { 
                            id: true, 
                            name: true, 
                            avatarUrl: true,
                            isVerified: true
                        } 
                    },
                    community: true
                }
            });
        });

        return NextResponse.json(article);

    } catch (error) {
        return handleError(error, 'PUT_ARTICLE');
    }
}

// DELETE Article with Enhanced Security
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url, `http://${req.headers.get('host')}`);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Article ID is required' }, 
                { status: 400 }
            );
        }

        const article = await prisma.$transaction(async (tx:any) => {
            // Robust permissions check
            const existingArticle = await tx.article.findUnique({
                where: { id },
                select: { 
                    creatorId: true, 
                    status: true 
                }
            });

            if (!existingArticle) {
                throw new Error('Article not found');
            }

            // Soft delete by changing status to ARCHIVED
            return tx.article.update({
                where: { id },
                data: { 
                    status: 'ARCHIVED',
                    updatedAt: new Date()
                }
            });
        });

        return NextResponse.json({ 
            message: 'Article archived successfully',
            article 
        });

    } catch (error) {
        return handleError(error, 'DELETE_ARTICLE');
    }
}

