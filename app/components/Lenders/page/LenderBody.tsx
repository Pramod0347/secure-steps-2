import LendersArticle from "../Articles";
import LendersLoan from "../Loans";


interface LenderBody {
    activeSection: 'loans' | 'articles';
    onSectionChange: (section: 'loans' | 'articles') => void;
}

const LenderBody: React.FC<LenderBody> = ({ activeSection, onSectionChange }) => {
    return (
        <div className='w-full'>
            <div className='flex flex-row items-center gap-[50px] justify-center text-[20px] md:text-[25px] font-[600] my-5 mt-20'>
                <p
                    className={`cursor-pointer ${activeSection === 'loans' ? 'text-[#E50914]' : ''}`}
                    onClick={() => onSectionChange('loans')}
                >
                    Loans
                </p>
                <p
                    className={`cursor-pointer ${activeSection === 'articles' ? 'text-[#E50914]' : ''}`}
                    onClick={() => onSectionChange('articles')}
                >
                    Articles
                </p>
            </div>

            
            {activeSection === 'loans' ? <LendersLoan /> : <LendersArticle />}
        </div>
    )
}

export default LenderBody;