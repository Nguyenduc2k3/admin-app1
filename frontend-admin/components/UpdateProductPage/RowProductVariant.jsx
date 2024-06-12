import React from 'react';
import axios from 'axios';
import { InputNumber } from 'antd';
import { FaTrash } from "react-icons/fa";

import UploadImageBox from '@/components/UploadImageBox';
import { swalert, swtoast } from "@/mixins/swal.mixin";

const RowProductVariant = ({ index, productVariantList, setProductVariantList, setIsLoading, refreshPage, productId }) => {

    const handleQuantityChange = (value) => {
        let updatedProductVariantList = [...productVariantList];
        updatedProductVariantList[index].quantity = value;
        setProductVariantList(updatedProductVariantList);
    };

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa biến thể sản phẩm",
                icon: "warning",
                text: "Bạn muốn xóa biến thể sản phẩm này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setIsLoading(true);
                        await axios.delete(`http://localhost:8000/api/products/${productId}/variants/${productVariantList[index].productVariantId}`);
                        refreshPage();
                        swtoast.success({
                            text: 'Xóa biến thể sản phẩm thành công!'
                        });
                    } catch (err) {
                        console.error(err);
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa biến thể sản phẩm vui lòng thử lại!'
                        });
                    } finally {
                        setIsLoading(false);
                    }
                }
            });
    };

    return (
        <tr className='row-product-variant'>
            <td className='col-colour text-center'>
                {productVariantList[index].color}
            </td>
            <td className='col-size text-center'>
                {productVariantList[index].size}
            </td>
            <td className='col-quantity text-center'>
                <InputNumber
                    value={productVariantList[index].quantity}
                    style={{ width: '100%' }}
                    onChange={handleQuantityChange}
                />
            </td>
            <td className='col-price text-center'>
                {productVariantList[index].price}
            </td>
            <td className='col-price-sale text-center'>
                {productVariantList[index].price_sale}
            </td>
            <td className='col-type text-center'>
                {productVariantList[index].type}
            </td>
            <td className='col-sku text-center'>
                {productVariantList[index].SKU}
            </td>
            <td className='col-is-active text-center'>
                {productVariantList[index].isActive ? 'Yes' : 'No'}
            </td>
            <td className='col-created-at text-center'>
                {new Date(productVariantList[index].createdAt).toLocaleDateString()}
            </td>
            <td className='col-updated-at text-center'>
                {new Date(productVariantList[index].updatedAt).toLocaleDateString()}
            </td>
            <td className="col-image">
                <UploadImageBox
                    index={index}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                />
            </td>
            <td className='col-delete text-center'>
                <FaTrash style={{ cursor: "pointer" }} title='Xóa' className="text-danger" onClick={handleDelete} />
            </td>
        </tr>
    );
};

export default RowProductVariant;
