// generateSlug
// import { generateSlug } from "@/app/utils/generateSlug";
// import { Prisma } from "@prisma/client";

// export const universityMiddleware = Prisma.defineExtension({
//   name: "UniversityMiddleware",
//   query: {
//     university: {
//       async create({ args, query }) {
//         if (args.data.name && args.data.location) {
//           args.data.slug = generateSlug(args.data.name, args.data.location);
//         }
//         return query(args);
//       },
//       async update({ args, query }) {
//         if (args.data.name && args.data.location) {
//           args.data.slug = generateSlug(args.data.name, args.data.location);
//         }
//         return query(args);
//       },
//     },
//   },
// });
