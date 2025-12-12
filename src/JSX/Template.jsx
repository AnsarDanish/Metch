import StringToFunction from "./StringToFunction";

export default function Template({json}) {

  
  const Template = StringToFunction(json);

  return (
    <div className="iframe" style={{ flexGrow: 1 }}>
      <Template />
    </div>
  );
}


