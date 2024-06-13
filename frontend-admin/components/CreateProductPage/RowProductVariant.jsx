import React from 'react';
import { InputNumber, Input } from 'antd';

import UploadImageBox from '@/components/UploadImageBox';

const RowProductVariant = ({ index, productVariantList, setProductVariantList }) => {

    const handleQuantityChange = (value) => {
        const updatedProductVariantList = [...productVariantList];
        updatedProductVariantList[index].quantity = value;
        setProductVariantList(updatedProductVariantList);
    }

    const handlePriceChange = (value) => {
        const updatedProductVariantList = [...productVariantList];
        updatedProductVariantList[index].price = value;
        setProductVariantList(updatedProductVariantList);
    }

    const handlePriceSaleChange = (value) => {
        const updatedProductVariantList = [...productVariantList];
        updatedProductVariantList[index].price_sale = value;
        setProductVariantList(updatedProductVariantList);
    }

    const handleSKUChange = (e) => {
        const updatedProductVariantList = [...productVariantList];
        updatedProductVariantList[index].SKU = e.target.value;
        setProductVariantList(updatedProductVariantList);
    }

    return (
        <tr className='row-product-variant'>
            <td className='col-colour text-center'>
                {productVariantList[index].color}
            </td>
            <td className='col-size text-center'>
                {productVariantList[index].size}
            </td>
            <td className='col-quantity text-center' style={{ width: '5%' }}>
                <InputNumber
                    value={productVariantList[index].quantity}
                    style={{ width: '100%' }}
                    onChange={handleQuantityChange}
                />
            </td>
            <td className='col-price text-center' style={{ width: '15%' }}>
                <InputNumber
                    value={productVariantList[index].price}
                    style={{ width: '100%' }}
                    onChange={handlePriceChange}
                />
            </td>
            <td className='col-price_sale text-center' style={{ width: '15%' }}>
                <InputNumber
                    value={productVariantList[index].price_sale}
                    style={{ width: '100%' }}
                    onChange={handlePriceSaleChange}
                />
            </td>
            <td className='col-sku text-center' style={{ width: '25%' }}>
                <Input
                    value={productVariantList[index].SKU}
                    style={{ width: '100%' }}
                    onChange={handleSKUChange}
                />
            </td>
            <td className="col-image" style={{ width: '45%' }}>
                <UploadImageBox
                    index={index}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                />
            </td>
        </tr>
    );
}

export default RowProductVariant;
