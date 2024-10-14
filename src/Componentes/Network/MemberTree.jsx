import React, { useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import ball from "../../assets/photos/ball2.png";
import { GetTree } from "../../Controllers/User/UserController";
import { toast } from "react-toastify";

const familyData = {
  name: "Root",
  children: [
    {
      name: "LEFT ",
      children: [
        {
          name: "Grandchild ",
          children: [{ name: "Great" }, { name: "Great" }],
        },
        {
          name: "Grandchild  ",
          children: [{ name: "Great" }, { name: "Great" }],
        },
      ],
    },
    {
      name: "RIGHT",
      children: [
        {
          name: "Grandchild",
          children: [{ name: "Great" }, { name: "Great" }],
        },
        {
          name: "Grandchild",
          children: [{ name: "Great" }, { name: "Great" }],
        },
      ],
    },
  ],
};

const styles = {
  node: {
    padding: "2px",
    borderRadius: "200px",
    display: "inline-block",
    position: "relative",
  },
  text: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
  },
};

const renderTreeNode = (node) => (
  <TreeNode
    label={
      <div
        style={styles.node}
        className="mb-6 border-black  dark:border-white  border-dotted  border-2"
      >
        <img alt="ball" src={ball} className="w-10 h-10" />
        <div style={styles.text} className="dark:text-gray-200">
          {node.name}
        </div>
      </div>
    }
  >
    {node.children && node.children.map((child) => renderTreeNode(child))}
  </TreeNode>
);

export default function MemberTree() {
  const UserTree = async () => {
    try {
      const response = await GetTree();
      if (response.status) {
        console.log(response);
      } else {
        toast.error("Something Went Wrong. Please Refresh.");
      }
    } catch (error) {
      toast.error("Something Went Wrong. Please Refresh.");
    }
  };

  useEffect(() => {
    UserTree();
  }, []);

  return (
    <div>
      <div className="tree-member-first-box flex flex-wrap ml-4 gap-16 border-2 border-black  dark:border-gray-400 rounded-lg  mb-6 p-2">
        <div className="">
          <p className="bg-[#ff9600] px-2 text-white rounded-lg">TARUN9742</p>
          <h1 className="font-bold text-xl dark:text-white">Left Team</h1>
          <ul className="list-disc ml-5 mt-2 dark:text-gray-200">
            <li className="dark:text-gray-300">Total Business: $0</li>
            <li className="dark:text-gray-300">Weekly Business: $0</li>
            <li className="dark:text-gray-300">Carry.Business: $0</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold  dark:text-white">Sponsor:TARUN</p>
          <h1 className="font-bold text-xl  dark:text-white">Right Team</h1>
          <ul className="list-disc ml-5 mt-2 dark:text-gray-200">
            <li className="dark:text-gray-300">Total Business: $0</li>
            <li className="dark:text-gray-300">Weekly Business: $0</li>
            <li className="dark:text-gray-300">Carry.Business: $0</li>
          </ul>
        </div>
      </div>
      <Tree
        lineWidth={"2px"}
        lineColor={"green"}
        lineBorderRadius={"10px"}
        label={
          <div
            style={styles.node}
            className="mb-6 border-black  dark:border-white  border-dotted  border-2"
          >
            <img alt="ball" src={ball} className="w-10 h-10" loading="lazy" />
            <div style={styles.text} className="dark:text-gray-200">
              {familyData.name}
            </div>
          </div>
        }
      >
        {familyData.children.map((child) => renderTreeNode(child))}
      </Tree>
    </div>
  );
}
