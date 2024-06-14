import React, { useState } from "react";
import { Input, Select, Switch, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const RowProductVariant = ({
  index,
  productVariant,
  setProductVariantList,
  productVariantList,
}) => {
  const [variant, setVariant] = useState(productVariant);

  const handleChange = (field, value) => {
    const updatedVariant = { ...variant, [field]: value };
    setVariant(updatedVariant);
    const updatedList = [...productVariantList];
    updatedList[index] = updatedVariant;
    setProductVariantList(updatedList);
  };

  const handleFileChange = ({ fileList }) => {
    handleChange("fileList", fileList);
  };

  return (
    <tr className="row-product-variant">
      <td className="col-colour text-center">
        <Input
          value={productVariant.colorName}
          onChange={(e) => handleChange("colorName", e.target.value)}
        />
      </td>
      <td className="col-size text-center">
        <Input
          value={productVariant.sizeName}
          onChange={(e) => handleChange("sizeName", e.target.value)}
        />
      </td>
      <td className="col-quantity text-center">
        <Input
          type="number"
          value={variant.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />
      </td>
      <td className="col-price text-center">
        <Input
          type="number"
          value={variant.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
      </td>
      <td className="col-price-sale text-center">
        <Input
          type="number"
          value={variant.priceSale}
          onChange={(e) => handleChange("priceSale", e.target.value)}
        />
      </td>
      <td className="col-type text-center">
        <Input
          value={variant.type}
          onChange={(e) => handleChange("type", e.target.value)}
        />
      </td>
      <td className="col-sku text-center">
        <Input
          value={variant.SKU}
          onChange={(e) => handleChange("SKU", e.target.value)}
        />
      </td>
      <td className="col-is-active text-center">
        <Switch
          checked={variant.isActive}
          onChange={(checked) => handleChange("isActive", checked)}
        />
      </td>
      <td className="col-created-at text-center">
        <DatePicker
          value={moment(variant.createdAt)}
          onChange={(date) => handleChange("createdAt", date)}
        />
      </td>
      <td className="col-updated-at text-center">
        <DatePicker
          value={moment(variant.updatedAt)}
          onChange={(date) => handleChange("updatedAt", date)}
        />
      </td>
      <td className="col-images text-center">
        <Upload
          listType="picture"
          fileList={variant.fileList}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </td>
    </tr>
  );
};

export default RowProductVariant;
