interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const categoryBadgeSuccess =
    "flex w-[70px] h-8 gap-1 rounded-2xl border-[1.5px] p-3 border-success-600 bg-green-100";
  const categoryBadgeFail =
    "flex w-[60px] h-8 gap-1 rounded-2xl border-[1.5px] p-3 border-red-600 bg-red-100";

  return (
    // <div
    //   className={status === "Good" ? categoryBadgeSuccess : categoryBadgeFail}
    // >
    //   <div
    //     className={
    //       status === "Good"
    //         ? "size-2 rounded-full bg-green-600"
    //         : "size-2 rounded-full bg-red-600"
    //     }
    //   >
    //     <span
    //       className={
    //         status === "Good"
    //           ? "flex w-full ml-3 -mt-1.5 text-[12px] font-medium text-success-700"
    //           : "flex w-full ml-3 -mt-1.5 text-[12px] font-medium text-red-700"
    //       }
    //     >
    //       {status}
    //     </span>
    //   </div>
    // </div>
    <div className="flex w-[120px] h-8 gap-1 rounded-2xl border-[1.5px] p-3 border-success-600 bg-green-100">
      <div className="size-2 rounded-full bg-green-600">
        <span className="flex w-[120px] ml-3 -mt-1.5 text-[12px] font-medium text-success-700">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
