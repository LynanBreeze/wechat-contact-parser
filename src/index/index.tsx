import { ReactElement, useState, useEffect } from "react";
import styles from "./index.module.scss";
import Papa from "papaparse";
import List from "./List";
import FileDrop from "./FileDrop";
import { split, trim, toArray } from "lodash";
import { ListItem, FormatedRemark } from "./types";

const formatRemark = (string: string): FormatedRemark => {
  const splitRes = split(trim(string), '"');
  let pointer = 0;
  const pointerMap = {
    1: "",
    2: "",
    3: "",
  };
  const arr = toArray(splitRes[0]);
  arr.forEach((letter, index) => {
    if (/[\u0000-\u001f]/.test(letter)) {
      if (!/[\u0000-\u001f]/.test(arr[index + 1])) {
        pointer++;
      }
    } else {
      if (pointer === 0) {
        pointer++;
      }
      pointerMap[pointer] += letter;
    }
  });
  return pointerMap;
};

const formatAvatar = (string: string): string[] => {
  return string
    .replace(/[\u0000-\u001f�]/g, " ")
    .split('"')[0]
    .match(/http(s)?:\/\/\S+/g);
};

interface IProps {}

export default function Index({}: IProps): ReactElement {
  const [contactList, setContactList] = useState<ListItem[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number>(1000);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (res) => {
          const [keys, ...data] = res.data;
          const list = data.map((dataItem) => {
            const obj = {} as ListItem;
            dataItem.forEach((attributeValue, index) => {
              obj[keys[index]] = attributeValue;
              if (keys[index] === "dbContactRemark") {
                obj.formatedRemark = formatRemark(attributeValue);
              }
              if (keys[index] === "dbContactHeadImage") {
                obj.formatedAvatar = formatAvatar(attributeValue);
              }
            });

            return obj;
          });
          const formatedList = list.filter(
            (item) => !!item.userName && item.type !== "4"
          );
          console.log(formatedList);

          setContactList(formatedList);
        },
      });
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.content}>
        {!contactList.length && <FileDrop onFileChange={onFileChange} />}
        {!!contactList.length && (
          <>
            <List data={contactList} viewportHeight={viewportHeight} />
            <div
              className={styles.backIcon}
              onClick={() => setContactList([])}
            ></div>
          </>
        )}
      </div>
    </div>
  );
}
