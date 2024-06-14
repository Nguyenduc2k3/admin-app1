import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Router from 'next/router';
import axios from "axios";
import { Input, InputNumber, Empty, Select, Button } from "antd";
import Header from "@/components/Header";
import CKeditor from "@/components/CKEditor";
import RowProductVariant from "@/components/UpdateProductPage/RowProductVariant";
import Loading from "@/components/Loading";
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from "@/config";

const { Option } = Select;

const UpdateProductPage = () => {
  const router = useRouter();
  const { product_id } = router.query;

  const [productField, setProductField] = useState({
    productId: "",
    productName: "",
    categoryId: "",
    categoryName: "",
    price: 0,
    description: "",
  });

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productVariantList, setProductVariantList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productVariantsLoading, setProductVariantsLoading] = useState(false); // state for loading product variants

  useEffect(() => {
    setEditorLoaded(true);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product_id) {
      fetchProduct();
    }
  }, [product_id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${homeAPI}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(`${homeAPI}/products/${product_id}`);
      const {
        id,
        name_product,
        category_id,
        name,
        price,
        description,
        product_variant_list,
      } = result.data;
      setProductField({
        productId: id,
        productName: name_product,
        categoryId: category_id,
        categoryName: name,
        price,
        description,
      });
      // Fetch product variants after fetching product details
      await fetchProductVariants(id);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductVariants = async (productId) => {
    try {
      setProductVariantsLoading(true);
      const response = await axios.get(`${homeAPI}/products/${productId}/variants`);
      setProductVariantList(await convertProductVariantList(response.data));
    } catch (error) {
      console.error("Failed to fetch product variants:", error);
    } finally {
      setProductVariantsLoading(false);
    }
  };

  const convertProductVariantList = async (productVariants) => {
    if (!Array.isArray(productVariants)) return [];
    return await Promise.all(
      productVariants.map(async (variant) => {
        const fileList = await Promise.all(
          variant.product_images.map(async ({ path }) => {
            const response = await fetch(path);
            const blob = await response.blob();
            const name = path.slice(-40, -4);
            const file = new File([blob], name, { type: blob.type });
            return {
              uid: name,
              name: name,
              url: path,
              originFileObj: file,
            };
          })
        );
        return {
          productVariantId: variant.id,
          colorId: variant.colorID,
          colorName: variant.color,
          sizeId: variant.sizeID,
          sizeName: variant.size,
          quantity: variant.quantity,
          price: variant.price,
          priceSale: variant.price_sale,
          type: variant.type,
          SKU: variant.SKU,
          isActive: variant.is_active,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
          fileList,
        };
      })
    );
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);

        const updateProductData = {
          id: productField.productId,
          name_product: productField.productName,
          category_id: productField.categoryId,
          price: productField.price,
          description: productField.description,
        };

        // Update product details
        await axios.put(`${homeAPI}/products/${product_id}`, updateProductData);

        // Update product variants
        await Promise.all(
          productVariantList.map(async (variant) => {
            const data = new FormData();
            data.append("id", variant.productVariantId);
            data.append("quantity", variant.quantity);
            variant.fileList.forEach((file) => {
              data.append("product_images", file.originFileObj);
            });
            await axios.put(
              `${homeAPI}/products/${product_id}/variants/${variant.productVariantId}`,
              data,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          })
        );

        swtoast.success({ text: "Cập nhật sản phẩm thành công!" });
        Router.push('/product/manage');
        fetchProduct(); // Refresh product details after update
      } catch (error) {
        console.error("Failed to update product:", error);
        swtoast.error({ text: "Cập nhật sản phẩm thất bại!" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validate = () => {
    const { productName, categoryId, price, description } = productField;
    if (!productName) {
      swtoast.error({ text: "Tên sản phẩm không được bỏ trống" });
      return false;
    }
    if (!categoryId) {
      swtoast.error({ text: "Danh mục sản phẩm không được bỏ trống" });
      return false;
    }
    if (!price) {
      swtoast.error({ text: "Giá sản phẩm không được bỏ trống" });
      return false;
    }
    if (!description) {
      swtoast.error({ text: "Mô tả sản phẩm không được bỏ trống" });
      return false;
    }
    return true;
  };

  const changeProductFieldHandler = (e) => {
    setProductField({
      ...productField,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <h1>Edit Product</h1>
      <form onSubmit={updateProduct}>
        <div className="mb-3 mt-3">
          <label className="form-label">Product ID:</label>
          <Input
            type="text"
            className="form-control"
            name="productId"
            value={productField.productId}
            disabled
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Product Name:</label>
          <Input
            type="text"
            className="form-control"
            name="productName"
            value={productField.productName}
            onChange={changeProductFieldHandler}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Category:</label>
          <Select
            id="product-category"
            style={{ width: "100%" }}
            placeholder="Chọn danh mục"
            value={productField.categoryId}
            onChange={(value, option) => {
              setProductField((prev) => ({
                ...prev,
                categoryId: value,
                categoryName: option.children,
              }));
            }}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Price:</label>
          <InputNumber
            className="form-control"
            name="price"
            value={productField.price}
            onChange={(value) =>
              setProductField((prev) => ({ ...prev, price: value }))
            }
            style={{ width: "100%" }}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Description:</label>
          <CKeditor
            name="description"
            data={productField.description}
            onChange={(data) =>
              setProductField((prev) => ({ ...prev, description: data }))
            }
            editorLoaded={editorLoaded}
          />
        </div>
        <div>
          <label className="form-label">Product Variants:</label>
          <table className="table w-100 table-hover align-middle table-bordered">
            <thead>
              <tr className="row-product-variant">
                <th className="col-colour text-center">Color</th>
                <th className="col-size text-center">Size</th>
                <th className="col-quantity text-center">Quantity</th>
                <th className="col-price text-center">Price</th>
                <th className="col-price-sale text-center">Sale Price</th>
                <th className="col-type text-center">Type</th>
                <th className="col-sku text-center">SKU</th>
                <th className="col-is-active text-center">Active</th>
                <th className="col-created-at text-center">Created At</th>
                <th className="col-updated-at text-center">Updated At</th>
                <th className="col-image text-center">Image</th>
                <th className="col-delete text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {productVariantList.length ? (
                productVariantList.map((item, index) => (
                  <RowProductVariant
                    key={index}
                    index={index}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                    setIsLoading={setIsLoading}
                    refreshPage={fetchProduct}
                    productId={product_id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="12">
                    <Empty />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateProductPage;
