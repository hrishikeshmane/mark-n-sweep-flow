import { Handle, Position } from "reactflow";

const Marked = () => {
  return (
    <div className="react-flow__node ">
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Right} />
      <span> &lt;unmarked&gt; </span>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default Marked;
