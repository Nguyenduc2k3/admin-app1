import React from 'react';
import { InputNumber } from 'antd';

import UploadImageBox from '@/components/UploadImageBox';

const RowProductVariant = ({ index, productVariantList, setProductVariantList }) => {

    const handleQuantityChange = (value) => {
        let productVariantListClone = [...productVariantList];
        productVariantListClone[index].quantity = value;
        setProductVariantList(productVariantListClone);
    }

    const handlePriceChange = (value) => {
        let productVariantListClone = [...productVariantList];
        productVariantListClone[index].price = value;
        setProductVariantList(productVariantListClone);
    }

    const handlePriceSaleChange = (value) => {
        let productVariantListClone = [...productVariantList];
        productVariantListClone[index].price_sale = value;
        setProductVariantList(productVariantListClone);
    }

    return (
        <>
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
                    <InputNumber
                        value={productVariantList[index].price}
                        style={{ width: '100%' }}
                        onChange={handlePriceChange}
                    />
                </td>
                <td className='col-price_sale text-center'>
                    <InputNumber
                        value={productVariantList[index].price_sale}
                        style={{ width: '100%' }}
                        onChange={handlePriceSaleChange}
                    />
                </td>
                <td className="col-image" style={{ width: '55%' }}>
                    <UploadImageBox
                        index={index}
                        productVariantList={productVariantList}
                        setProductVariantList={setProductVariantList}
                    />
                </td>
            </tr>
        </>
    )
}

export default RowProductVariant;
