import { memo, useEffect, useMemo, useState } from "react";
import { Modal, Steps } from "antd";

function ApproveFlows(props: any) {
  const { open, id, onCancel, detailRequest } = props;
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (open && id) {
      setLoading(() => true);
      detailRequest(id)
        .then((response: any) => {
          if (response.code === 0) {
            setDetails(() => response.data.approveFlows);
          }
        })
        .finally(() => setLoading(() => false));
    }
  }, [id, open]);

  const computeItems = useMemo(() => {
    const items: any[] = [];
    details.forEach((item: any, index: number) => {
      const description = (
        <>
          <p>{item.nodeDes}</p>
          <p>
            {index === 0 ? "提交人" : "审批人"}：{item.userName}
          </p>
          <p>
            {index === 0 ? "提交时间" : "审批时间"}：{item.createTime}
          </p>
          <p>原因说明：{item.remark}</p>
        </>
      );
      items.push({ title: item.nodeDes, description });
    });
    return items;
  }, [details]);

  return (
    <Modal open={open} onOk={onCancel} title="审核流程" onCancel={onCancel}>
      <Steps
        current={details.length}
        direction="vertical"
        items={computeItems}
      />
    </Modal>
  );
}

export default memo(ApproveFlows);
