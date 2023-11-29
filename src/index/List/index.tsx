import { ReactElement, useEffect, useState } from "react";
import { Table, Input } from "antd";
import { startsWith, debounce } from "lodash";
import styles from "./index.module.scss";
import { ListItem } from "../types";

const columns = [
  {
    title: "头像",
    dataIndex: "formatedAvatar",
    key: "formatedAvatar",
    render: (data: string) => {
      const avatar = data?.[1] || data?.[0];
      return avatar ? (
        <img
          src={avatar}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "2px",
          }}
        />
      ) : (
        <div className={styles.emptyAvatar}></div>
      );
    },
  },
  {
    title: "微信id",
    dataIndex: "userName",
    key: "userName",
    render: (data: string, record: ListItem) => {
      const newId =
        record.formatedRemark?.[2] !== data &&
        /[a-z0-9]/.test(record.formatedRemark?.[2])
          ? record.formatedRemark?.[2]
          : "";
      return (
        <div>
          <span
            style={{
              textDecoration: newId ? "line-through" : "",
            }}
          >
            {data}
          </span>
          {!!newId && (
            <>
              <br />
              <span>{newId}</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    title: "微信名称",
    dataIndex: "dbContactRemark",
    key: "dbContactRemark",
    render: (_: string, record: ListItem) => {
      if (record?.formatedRemark?.[1]) {
        return record.formatedRemark?.[1];
      } else {
        return record.userName;
      }
    },
  },
  {
    title: "备注",
    dataIndex: "dbContactRemark",
    key: "dbContactRemark",
    render: (_: string, record: ListItem) => {
      if (startsWith(record.userName, "gh_")) {
        return record.formatedRemark?.[1];
      }
      if (record?.formatedRemark?.[3]) {
        return record.formatedRemark?.[3];
      } else if (record?.formatedRemark?.[2]) {
        return record.formatedRemark?.[2];
      } else if (record?.formatedRemark?.[1]) {
        return record.formatedRemark?.[1];
      } else {
        return record.userName;
      }
    },
  },
];

interface IProps {
  data: ListItem[];
  viewportHeight: number;
}

export default function ({ data, viewportHeight }: IProps): ReactElement {
  const [keyword, setKeyword] = useState("");
  const [filteredList, setFilteredList] = useState(data);

  useEffect(() => {
    handleSearch();
  }, [keyword]);

  const handleSearch = debounce(() => {
    setFilteredList(
      data.filter((item) => {
        return (
          item.dbContactRemark.includes(keyword) ||
          item.userName.includes(keyword)
        );
      })
    );
    if (!keyword) {
      setFilteredList(data);
    }
  }, 400);

  return (
    <>
      <Input
        placeholder='输入微信id或微信名称'
        className={styles.searchInput}
        onChange={(e) => setKeyword(e.target.value)}
        allowClear
      />
      <Table
        className={styles.table}
        rowKey='userName'
        columns={columns}
        dataSource={keyword.length ? filteredList : data}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0, wordBreak: "break-all" }}>
              {JSON.stringify(record, null, 2)}
            </div>
          ),
          rowExpandable: () => true,
        }}
        pagination={{
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{
          y: viewportHeight - 250,
        }}
      />
    </>
  );
}
