export interface ListItem {
  certificationFlag: string;
  dbContactBrand: string;
  dbContactChatRoom: string;
  dbContactEncryptSecret: string;
  dbContactHeadImage: string;
  formatedAvatar: string[];
  dbContactLocal: string;
  dbContactOpenIM: string;
  dbContactOther: string;
  dbContactProfile: string;
  dbContactRemark: string;
  formatedRemark: FormatedRemark;
  dbContactSocial: string;
  encodeUserName: string;
  extFlag: string;
  imgStatus: string;
  openIMAppid: string;
  type: string;
  typeExt: string;
  userName: string;
}

export interface FormatedRemark {
  "1": string;
  "2": string;
  "3": string;
}
