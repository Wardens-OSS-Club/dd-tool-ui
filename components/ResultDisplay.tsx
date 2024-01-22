import { ethers } from "ethers";

interface ResultDisplayProps {
  result: { [key: string]: any };
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const renderValue = (value: any, parentKey = "") => {
    if (Array.isArray(value)) {
      return (
        <div className="ml-5">
          {value.map((item, index) => (
            <div key={`${parentKey}[${index}]`}>
              {renderValue(item, `${parentKey}[${index}]`)}
            </div>
          ))}
        </div>
      );
    } else if (value && typeof value === "object") {
      return (
        <div className="ml-5">
          {Object.entries(value).map(([key, val]) => (
            <div key={`${parentKey}.${key}`}>
              <strong>{key}:</strong> {renderValue(val, `${parentKey}.${key}`)}
            </div>
          ))}
        </div>
      );
    }
    return (
      <span>
        {typeof value === "bigint" ? ethers.formatUnits(value, 0) : value}
      </span>
    );
  };

  return (
    <div className=" overflow-wrap break-word shadow-md">
      {Object.entries(result).map(([key, value]) => (
        <div
          key={key}
          className=" bg-gray-200 border border-gray-300 rounded p-2.5 my-1 flex items-center justify-between text-gray-800 text-sm overflow-wrap break-word"
        >
          <span className="font-bold mr-2.5">{key}:</span>
          {renderValue(value, key)}
        </div>
      ))}
    </div>
  );
};

export default ResultDisplay;
