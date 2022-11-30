import { Handle, Position } from "reactflow";

const Unmarked = () => {
  return (
    <div className="react-flow__node unmarked-node">
      <Handle type="target" position={Position.Top} />
      <span> &lt;unmarked&gt; </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default Unmarked;
