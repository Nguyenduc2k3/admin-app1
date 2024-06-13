import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Empty, Spin, Alert } from 'antd';
import axios from 'axios';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';

import * as actions from '../../store/actions';

const ProductManagementPage = () => {
    const [listProductVariant, setListProductVariant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const getListProductVariant = async () => {
            try {
                const [productResult, imagesResult] = await Promise.all([
                    axios.get('http://localhost:8000/api/products'),
                    axios.get('http://localhost:8000/api/product-images')
                ]);

                const products = productResult.data;
                const images = imagesResult.data;

                const productsWithImages = products.map(product => {
                    const productImage = images.find(img => img.product_id === product.id);
                    return {
                        ...product,
                        imageUrl: productImage ? productImage.url : null
                    };
                });

                setListProductVariant(productsWithImages);
            } catch (err) {
                setError('Failed to fetch product variants or images. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        getListProductVariant();
    }, []);

    const refreshProductVariantTable = async () => {
        setLoading(true);
        try {
            const [productResult, imagesResult] = await Promise.all([
                axios.get('http://localhost:8000/api/products'),
                axios.get('http://localhost:8000/api/product-images')
            ]);

            const products = productResult.data;
            const images = imagesResult.data;

            const productsWithImages = products.map(product => {
                const productImage = images.find(img => img.product_id === product.id);
                return {
                    ...product,
                    imageUrl: productImage ? productImage.url : null
                };
            });

            setListProductVariant(productsWithImages);
        } catch (err) {
            setError('Failed to refresh product variants or images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-manager">
            <Header title="Quản lý sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page">
                    <button onClick={() => Router.push('/product/create')} className="to-add-product-page-btn">
                        Thêm sản phẩm
                    </button>
                </div>
                <Heading title="Tất cả sản phẩm" />
                <div className="wrapper-product-admin table-responsive">
                    {loading ? (
                        <Spin tip="Loading...">
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}></td></tr>
                                </tbody>
                            </table>
                        </Spin>
                    ) : error ? (
                        <Alert message="Error" description={error} type="error" showIcon />
                    ) : (
                        <>
                            <table className='table product-admin w-100'>
                                <thead className="w-100 align-middle text-center">
                                    <tr className="fs-6 w-100">
                                        <th title='Tên sản phẩm' className="name col-infor-product">
                                            Sản phẩm
                                        </th>
                                        <th title='Giá sản phẩm' className="col-price">Giá</th>
                                        <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                        <th title="Chi tiết" className="col-detail">Chi tiết</th>
                                        <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                                    </tr>
                                </thead>
                            </table>
                            {listProductVariant.length ? (
                                listProductVariant.map((productVariant, index) => (
                                    <ProductAdmin
                                        key={index}
                                        product_id={productVariant.id}
                                        product_variant_id={productVariant.product_variant_id}
                                        product_name={productVariant.name_product}
                                        product_image={productVariant.imageUrl}
                                        colour_name={productVariant.color}
                                        size_name={productVariant.size}
                                        price={productVariant.price}
                                        quantity={productVariant.quantity}
                                        state={productVariant.state}
                                        created_at={productVariant.created_at}
                                        refreshProductVariantTable={refreshProductVariantTable}
                                    />
                                ))
                            ) : (
                                <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                    <tbody>
                                        <tr><td colSpan={6}><Empty /></td></tr>
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagementPage;
