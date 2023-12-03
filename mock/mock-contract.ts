export const MOCK_CONTRACT = [
  {
    id: "0",
    content: "getPricePerFullShare()",
    functionString:
      "function getPricePerFullShare() external view returns (uint256)",
    address: "0xBA485b556399123261a5F9c95d413B4f93107407",
    inputs: [],
  },
  {
    id: "1",
    content: "available()",
    functionString: "function available() external view returns (uint256)",
    address: "0xBA485b556399123261a5F9c95d413B4f93107407",
    inputs: [],
  },
  {
    id: "2",
    content: "balanceOf()",
    functionString:
      "function balanceOf(address account) external view returns (uint256)",
    address: "0xBA485b556399123261a5F9c95d413B4f93107407",
    inputs: [{ name: "Account", type: "address" }],
  },
  {
    id: "3",
    content: "getPoolId()",
    functionString: "function getPoolId() external view returns (bytes32)",
    address: "0x1ee442b5326009bb18f2f472d3e0061513d1a0ff",
    inputs: [],
  },
  {
    id: "4",
    content: "getPoolTokens()",
    functionString:
      "function getPoolTokens(bytes32 poolId) external view returns (address[],uint256[],uint256 lastChangeBlock)",
    address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    inputs: [{ name: "PoolId", type: "bytes32" }],
  },
];
