# VectorShift Pipeline Builder

A visual, node-based pipeline builder built with React and ReactFlow, paired with a FastAPI backend for graph validation. Originally built as a frontend technical assessment, extended with extra features for a polished, production-feel experience.

## Features

**Node abstraction** — every node type (Input, Output, LLM, Text, API Call, Filter, Merge, Transform, Note) is built on a single `BaseNode` component, making it trivial to add new node types with consistent styling and handle logic.

**Dynamic text variables** — type `{{variable}}` inside a Text node and a new input handle appears automatically on the node, using ReactFlow's `useUpdateNodeInternals`.

**Connection validation** — prevents self-connections, duplicate edges, and invalid directions (e.g. connecting into an Input node), with toast notifications for feedback.

**Spotlight search** — press `Ctrl+Space` to open a fuzzy search palette and drop any node onto the canvas without dragging from the toolbar.

**Undo / Redo** — full history tracking with `Ctrl+Z` / `Ctrl+Y`.

**Export JSON** — download the current pipeline (nodes + edges) as a JSON file.

**Backend DAG validation** — clicking Submit sends the pipeline to a FastAPI backend, which counts nodes/edges and checks whether the graph is a valid DAG (cycle detection via DFS), then animates the edges and shows the result.

## Tech stack

- **Frontend:** React, ReactFlow, Zustand
- **Backend:** Python, FastAPI

## Running locally

**Frontend**
```bash
cd frontend
npm i
npm start
```
Runs on `http://localhost:3000`

**Backend**
```bash
cd backend
uvicorn main:app --reload
```
Runs on `http://localhost:8000`

## Architecture notes

All nodes share the `BaseNode` component (`frontend/src/nodes/baseNode.js`), which handles styling, color theming per node type, and Handle positioning. Individual node files (`inputNode.js`, `textNode.js`, etc.) only define their content and input/output configuration, keeping node definitions minimal and consistent.

State is managed globally with Zustand (`store.js`), including an undo/redo history stack that snapshots state before destructive actions.
