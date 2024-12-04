import { useHooks } from "@/hooks";

export function BankCard() {
  const { userFullName } = useHooks();
  return (
    <div className="flex flex-col mt-3 p-2">
      <div className="relative flex h-[190px] w-full max-w-[320px] justify-between rounded-[20px] border border-white bg-bank-gradient shadow-creditCard backdrop-blur-[6px]">
        <div className="relative z-10 flex size-full max-w-[228px] flex-col justify-between rounded-l-[20px] bg-gray-700 bg-bank-gradient px-5 pb-4 pt-5">
          <div>
            <h1 className="text-16 font-semibold text-white">
              Finance Management System
            </h1>
          </div>

          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {userFullName}
              </h1>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              **** **** **** <span className="text-16">****</span>
            </p>
          </article>
        </div>
        <div className="flex flex-1 flex-col items-end justify-between rounded-r-[20px] bg-bank-gradient bg-cover bg-center bg-no-repeat pr-7 py-5">
          <img src="/icons/Paypass.svg" width={20} height={24} alt="pay" />
          <img
            src="/icons/mastercard.svg"
            width={30}
            height={32}
            alt="mastercard"
            className="ml-10"
          />
        </div>
        <img
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0"
        />
      </div>
    </div>
  );
}
