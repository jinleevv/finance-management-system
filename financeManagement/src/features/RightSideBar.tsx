import { Label } from "@/components/ui/label";
import { BankCard } from "./BankCard";
import { useHooks } from "@/hooks";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function RightSideBar() {
  const { clientII, userFullName, userEmail, topCategories, setTopCatetories } =
    useHooks();

  async function handleTopCategories() {
    await clientII.get("/api/top-categories-count/").then((res) => {
      setTopCatetories({
        first: {
          name: res.data[0].category,
          count: (res.data[0].count / res.data.total) * 100,
        },
        second: {
          name: res.data[1].category,
          count: (res.data[1].count / res.data.total) * 100,
        },
        third: {
          name: res.data[2].category,
          count: (res.data[2].count / res.data.total) * 100,
        },
      });
    });
  }

  return (
    <aside className="no-scrollbar hidden h-screen max-h-screen w-4/12 flex-col border-l border-gray-200 xl:flex xl:overflow-y-scroll !important">
      <section className="flex flex-col pb-8">
        <div className="h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat">
          <div className="relative flex px-6 max-xl:justify-center">
            <div className="flex-center absolute top-16 size-24 rounded-full bg-gray-100 border-8 border-white p-4 shadow-profile">
              <span className="text-5xl font-bold text-black m-2.5">
                {userFullName[0]}
              </span>
            </div>
            <div className="flex flex-col pt-44">
              <Label className="text-3xl font-bold">{userFullName}</Label>
              <Label className="ml-1 text-xs text-gray-600">{userEmail}</Label>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-28">
        <Label className="ml-3 text-2xl font-bold">My Card </Label>
        <BankCard />
      </section>
      <section className="mt-10 ml-3 mr-3 border-t">
        <div className="flex mt-8 justify-between">
          <Label className="text-2xl font-bold">My Usage</Label>
          <Button size="sm" onClick={handleTopCategories}>
            Check
          </Button>
        </div>
        <div className="space-y-5">
          <Label className="text-sm">Top Categories</Label>
          <div className="rounded-md border p-3">
            <div className="grid space-y-3">
              <Label className="text-sm overflow-auto">
                {topCategories.first.name}
              </Label>
              <Progress value={topCategories.first.count} className="h-2" />
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="grid space-y-3">
              <Label className="text-sm overflow-auto">
                {topCategories.second.name}
              </Label>
              <Progress value={topCategories.second.count} className="h-2" />
            </div>
          </div>
          <div className="rounded-md border p-3">
            <div className="grid space-y-3">
              <Label className="text-sm overflow-auto">
                {topCategories.third.name}
              </Label>
              <Progress value={topCategories.third.count} className="h-2" />
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
