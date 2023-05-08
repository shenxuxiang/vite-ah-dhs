import React, { memo, useEffect, useCallback, useMemo, useRef } from "react";
import { isArray, useReducer } from "@/utils";
import { Input, Tree } from "antd";
import classes from "./index.module.less";

type TreeNode = {
  title: string;
  key: string;
  children?: TreeNode[];
};

type FlatArrayTreeData = Omit<TreeNode, "children">[];

// 过滤、筛选出目标节点（节点被标记红色）
function filterTreeNode(data: TreeNode[], searchValue: string): TreeNode[] {
  return data.map((item) => {
    const { title, key, children } = item;
    const index = title.indexOf(searchValue);

    let newTitle: any = title;
    if (index > -1) {
      const beforeContent = title.slice(0, index);
      const afterContent = title.slice(index + searchValue.length);
      newTitle = (
        <span>
          {beforeContent}
          <span style={{ color: "#f50" }}>{searchValue}</span>
          {afterContent}
        </span>
      );
    }

    if (children?.length) {
      return {
        title: newTitle,
        key,
        children: filterTreeNode(children, searchValue),
      };
    } else {
      return { title: newTitle, key };
    }
  });
}

// 获取父节点的 key
export function getParentKey(key: string, tree: TreeNode[]): string | null {
  for (let i = 0; i < tree.length; i++) {
    const { children, key: pKey } = tree[i];
    if (!children?.length) continue;
    if (children.some((item) => item.key === key)) {
      return pKey;
    } else {
      const pKey = getParentKey(key, children);
      if (pKey) return pKey;
    }
  }
  return null;
}

// 拉平 TreeData 格式的数组
function flatTreeData(tree: TreeNode | TreeNode[]): FlatArrayTreeData {
  const stack: TreeNode[] = isArray(tree) ? [...tree] : [tree];
  const result = [] as FlatArrayTreeData;
  while (stack.length) {
    const { key, title, children } = stack.shift()!;
    result.push({ title, key });
    if (!children?.length) continue;
    for (let i = 0; i < children.length; i++) {
      stack.unshift(children[i]);
    }
  }
  return result;
}

function initialState() {
  return {
    // 过滤内容
    searchValue: "",
    // 是否自动展开
    autoExpandParent: true,
    // 选中的节点数组
    checkedKeys: [] as React.Key[],
    // Tree 组件的展开项
    expandedKeys: [] as React.Key[],
    // 扁平的 TreeData 数组
    flatArrayTreeData: [] as FlatArrayTreeData,
  };
}

type TreeComponentProps = {
  checkable?: boolean;
  treeData: TreeNode[];
  checkedKeys?: React.Key[];
  defaultCheckedKeys?: React.Key[];
  onChange?: (checkedKeys: React.Key[]) => void;
  filterOption?:
    | boolean
    | ((data: TreeNode[], searchValue: string) => TreeNode[]);
};

/**
 * 二次封装的 Tree 组件
 * @param { filterOption } 表示是否支持条件过滤，默认 true。可以自定义过滤方法，默认使用 filterTreeNode。
 * @param { treeData }     组件的数据源，数据格式为：TreeNode。
 * @param { checkedKeys }  受控，被选中的子节点集合。
 * @param { checkable }    是否展示复选框。
 * @param { onChange }     事件回调函数，当修改被选中的子节点时触发。
 */
function TreeComponent(props: TreeComponentProps) {
  const [state, setState] = useReducer(initialState);
  const {
    flatArrayTreeData,
    searchValue,
    expandedKeys,
    autoExpandParent,
    checkedKeys,
  } = state;

  const {
    onChange,
    checkable,
    defaultCheckedKeys,
    filterOption = true,
    treeData: propsTreeData,
    checkedKeys: propCheckedKeys,
  } = props;

  // 是否组件内容修改了 checkedKeys
  const isInternatModifiedCheckedKeys = useRef(false);

  useEffect(() => {
    setState({ flatArrayTreeData: flatTreeData(propsTreeData) });
  }, [propsTreeData]);

  useEffect(() => {
    if (propCheckedKeys === undefined) {
      return;
    } else if (isInternatModifiedCheckedKeys.current) {
      isInternatModifiedCheckedKeys.current = false;
      return;
    } else {
      setState({ checkedKeys: propCheckedKeys });
    }
  }, [propCheckedKeys]);

  // 实时计算 Tree 组件的数据源
  const computeTreeData = useMemo(() => {
    if (!searchValue) return propsTreeData;
    if (typeof filterOption === "function") {
      return filterOption(propsTreeData, searchValue);
    } else {
      return filterTreeNode(propsTreeData, searchValue);
    }
  }, [searchValue, propsTreeData, filterOption]);

  // 点击 Tree 组件的复选框时触发
  const handleTreeCheck = useCallback((checkedKeys: any) => {
    isInternatModifiedCheckedKeys.current = true;
    setState({ checkedKeys });
    onChange?.(checkedKeys);
  }, []);

  // 手动展开/折叠 Tree 组件时需要将 autoExpandParent（是否自动展开父节点）设置为 false。
  const handleTreeExpand = useCallback((newExpandedKeys: React.Key[]) => {
    setState({ expandedKeys: newExpandedKeys, autoExpandParent: false });
  }, []);

  const handleSearchChange = useCallback(
    (event: any) => {
      const value = event.target.value.trim();
      // 根据条件过滤出目标节点的父节点的 key。
      const newExpandedKeys = flatArrayTreeData
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, propsTreeData);
          }
          return null;
        })
        .filter(Boolean) as string[];

      // 根据过滤条件查询时 autoExpandParent（是否自动展开父节点）需要设置为 true
      setState({
        expandedKeys: newExpandedKeys,
        autoExpandParent: true,
        searchValue: value,
      });
    },
    [flatArrayTreeData]
  );

  return (
    <>
      {!!filterOption && (
        <Input.Search
          style={{ marginBottom: 8 }}
          placeholder="请输入关键字进行过滤"
          onChange={handleSearchChange}
        />
      )}
      <div className={classes.tree_wrapper}>
        <Tree
          checkable={checkable}
          onCheck={handleTreeCheck}
          checkedKeys={checkedKeys}
          treeData={computeTreeData}
          onExpand={handleTreeExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          defaultCheckedKeys={defaultCheckedKeys}
        />
      </div>
    </>
  );
}

export default memo(TreeComponent);
