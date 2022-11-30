import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Background,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { Heap } from "@datastructures-js/heap";

import "./index.css";
import Unmarked from "./Unmarked";
import Marked from "./Marked";
import Graph from "graph-data-structure";
import { nanoid } from "nanoid";

const initialNodes = [
  {
    id: "0",
    type: "input",
    data: { label: "<global>" },
    position: { x: 0, y: 10 }
  }
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 3
};

const nodeTypes = { unmarked: Unmarked, marked: Marked };

const graph = new Graph();

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { project } = useReactFlow();

  // useEffect(() => {
  //   console.log("nodes", nodes);
  //   console.log("edegs", edges);
  // });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      // const targetIsPane = true;
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top
          }),
          data: { label: `Object ${id}` },
          type: "default"
        };

        setNodes((nds) => nds.concat(newNode));

        //add egde to graph
        console.log("New Connection", connectingNodeId.current, id);
        graph.addEdge(connectingNodeId.current, id);

        setEdges((eds) => {
          const idd = `reactflow__edge-${connectingNodeId.current}-${id}`;

          return eds.concat({
            id: idd,
            source: connectingNodeId.current,
            target: id
          });
        });
      }
      if (event.target.classList.contains("react-flow__handle")) {
        const id = event.target.getAttribute("data-nodeid");
        //add egde to graph
        console.log("New Connection", connectingNodeId.current, id);
        graph.addEdge(connectingNodeId.current, id);

        setEdges((eds) => {
          const idd = `reactflow__edge-${nanoid()}-${
            connectingNodeId.current
          }-${id}`;

          return eds.concat({
            id: idd,
            source: connectingNodeId.current,
            target: id
          });
        });
      }
    },
    [project]
  );

  const edgesDeleteHandler = (e) => {
    // delete edge from graph
    graph.removeEdge(e[0].source, e[0].target);
  };

  const markHandler = () => {
    console.log(graph.serialize());
    // iterate over nodes and check shortest distance if exception mark the node
    nodes.forEach((n) => {
      try {
        const path = graph.shortestPath("0", n.id);
      } catch (err) {
        setNodes((prev) => [
          ...prev.filter((node) => node.id !== n.id),
          { ...n, type: "unmarked" }
        ]);
      }
    });
  };

  const sweepHandler = () => {
    //deete all the marked nodes
    setNodes((prev) => prev.filter((n) => n.type !== "unmarked"));
  };

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        onEdgesDelete={edgesDeleteHandler}
      />
      <div className="actions">
        <button onClick={markHandler}>mark()</button>
        <button onClick={sweepHandler}>sweep()</button>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
