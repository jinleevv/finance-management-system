import axios from "axios";
import { startOfMonth } from "date-fns";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { DateRange } from "react-day-picker";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

export type MyTransactionsData = {
  trans_date: Date;
  billing_amount: number;
  merchant_name: string;
  category: string;
  purpose: string;
  first_name: string;
  last_name: string;
  tps: number;
  tvq: number;
  img: string;
};

export type StatusBankTransactionsData = {
  status: string;
  trans_date: Date;
  post_date: Date;
  billing_amount: number;
  merchant_name: string;
};

export type EntireBankTransactionsData = {
  trans_date: Date;
  post_date: Date;
  billing_amount: number;
  merchant_name: string;
  first_name: string;
  last_name: string;
};

export type DateRangeType = {
  from: string;
  to: string;
};

export type CountCategoryType = {
  name: string;
  count: number;
};

export type TopCategoriesType = {
  first: CountCategoryType;
  second: CountCategoryType;
  third: CountCategoryType;
};

const initialFromDate = startOfMonth(new Date());
const initialToDate = new Date();

const dateAtom = atomWithImmer<DateRange | undefined>({
  from: initialFromDate,
  to: initialToDate,
});

const loggedInUserAtom = atomWithImmer<boolean>(false);
const currentPageAtom = atomWithImmer<string>("Home");
const firstNameAtom = atomWithImmer<string>("");
const lastNameAtom = atomWithImmer<string>("");
const fullNameAtom = atomWithImmer<string>("");
const userEmailAtom = atomWithImmer<string>("");
const userDepartmentAtom = atomWithImmer<string>("");
const myTableDataAtom = atomWithImmer<Array<MyTransactionsData>>([]);
const myMissingUploadedDataAtom = atomWithImmer<Array<MyTransactionsData>>([]);
const mymissingBankDataAtom = atomWithImmer<Array<StatusBankTransactionsData>>(
  []
);
const statusBankTableDataAtom = atomWithImmer<
  Array<StatusBankTransactionsData>
>([]);
const entireBankTableDataAtom = atomWithImmer<
  Array<EntireBankTransactionsData>
>([]);
const transactionHistoryTabAtom = atomWithImmer<string>("My_Transactions");
const topCategoriesAtom = atomWithImmer<TopCategoriesType>({
  first: { name: "default", count: 100 },
  second: { name: "default", count: 50 },
  third: { name: "default", count: 70 },
});
const balanceStatusAtom = atomWithImmer<string>("");
const departmentCreditCardInfoAtom = atomWithImmer<Array<any>>([]);
const ControlUploadedTransactionsDataAtom = atomWithImmer<
  Array<MyTransactionsData>
>([]);
const currentQuarterLimitAtom = atomWithImmer<number>(0);
const currentQuarterUsageAtom = atomWithImmer<number>(0);

export function useHooks() {
  const clientI = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });
  const clientII = axios.create({
    baseURL: "http://localhost:8000",
  });
  const urlII = "http://localhost:8000";

  const [loggedInUser, setLoggedInUser] = useAtom(loggedInUserAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [userFirstName, setUserFirstName] = useAtom(firstNameAtom);
  const [userLastName, setUserLastName] = useAtom(lastNameAtom);
  const [userFullName, setUserFullName] = useAtom(fullNameAtom);
  const [userEmail, setUserEmail] = useAtom(userEmailAtom);
  const [userDepartment, setUserDepartment] = useAtom(userDepartmentAtom);
  const [myTableData, setMyTableData] = useAtom(myTableDataAtom);
  const [myMissingUploadedData, setMyMissingUploadedData] = useAtom(
    myMissingUploadedDataAtom
  );
  const [myMissingBankData, setMyMissingBankData] = useAtom(
    mymissingBankDataAtom
  );
  const [statusBankTableData, setStatusBankTableData] = useAtom(
    statusBankTableDataAtom
  );
  const [entireBankTableData, setEntireBankTableDate] = useAtom(
    entireBankTableDataAtom
  );
  const [calenderDate, setCalenderDate] = useAtom(dateAtom);
  const [transactionHistoryTab, setTransactionHistoryTab] = useAtom(
    transactionHistoryTabAtom
  );
  const [topCategories, setTopCatetories] = useAtom(topCategoriesAtom);
  const [balanceStatus, setBalanceStatus] = useAtom(balanceStatusAtom);
  const [departmentCreditCardInfo, setDepartmentCreditCardInfo] = useAtom(
    departmentCreditCardInfoAtom
  );
  const [entireUserUploadedTransactions, setEntireUserUploadedTransactions] =
    useAtom(ControlUploadedTransactionsDataAtom);
  const [currentQuarterLimit, setCurrentQuarterLimit] = useAtom(
    currentQuarterLimitAtom
  );
  const [currentQuarterUsage, setCurrentQuarterUsage] = useAtom(
    currentQuarterUsageAtom
  );

  return {
    clientI,
    clientII,
    urlII,
    loggedInUser,
    setLoggedInUser,
    currentPage,
    setCurrentPage,
    userFirstName,
    setUserFirstName,
    userLastName,
    setUserLastName,
    userFullName,
    setUserFullName,
    userEmail,
    setUserEmail,
    userDepartment,
    setUserDepartment,
    myTableData,
    setMyTableData,
    myMissingUploadedData,
    setMyMissingUploadedData,
    myMissingBankData,
    setMyMissingBankData,
    statusBankTableData,
    setStatusBankTableData,
    entireBankTableData,
    setEntireBankTableDate,
    calenderDate,
    setCalenderDate,
    transactionHistoryTab,
    setTransactionHistoryTab,
    topCategories,
    setTopCatetories,
    balanceStatus,
    setBalanceStatus,
    departmentCreditCardInfo,
    setDepartmentCreditCardInfo,
    entireUserUploadedTransactions,
    setEntireUserUploadedTransactions,
    currentQuarterLimit,
    setCurrentQuarterLimit,
    currentQuarterUsage,
    setCurrentQuarterUsage,
  };
}
