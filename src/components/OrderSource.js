import { Tab, Tabs } from "@blueprintjs/core";

export default function OrderSource({
  sources = [],
  currSource,
  updateSource,
}) {
  return (
    <>
      <Tabs
        animate
        // onChange={(e) => changeSource(e)}

        onChange={updateSource}
        selectedTabId={currSource}
      >
        {sources.map((ob) => (
          <Tab
            key={ob.source_name}
            className="s-tabs !outline-none"
            title={
              <div className="flex text-lg items-center min-w-[6rem] pb-1">
                <img src={ob.image} alt="" />
                <span>{ob.source_name}</span>
              </div>
            }
            id={ob.source_name}
          />
        ))}
      </Tabs>
      <hr className="!w-full " />
    </>
  );
}
