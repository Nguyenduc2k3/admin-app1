import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Empty, Spin, Alert, Pagination, Button } from 'antd';
import axios from 'axios';
import { homeAPI } from '@/config';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';

import * as actions from '../../store/actions';

const ProductManagementPage = () => {
    const [listProductVariant, setListProductVariant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchProductVariants();
    }, []);

    const fetchProductVariants = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productResult, imagesResult, variantsResult] = await Promise.all([
                axios.get(`${homeAPI}/products`),
                axios.get(`${homeAPI}/product-images`),
                axios.get(`${homeAPI}/all-variant`)
            ]);

            const products = productResult.data;
            const images = imagesResult.data;
            const variants = variantsResult.data;

            const productsWithVariants = products.map(product => {
                const productImage = images.find(img => img.product_id === product.id);
                const productVariant = variants.find(variant => variant.product_id === product.id);
                return {
                    ...product,
                    price: productVariant ? productVariant.price : null,
                    product_variant_id: productVariant ? productVariant.id : null,
                    imageUrl: productImage ? productImage.url : null,
                    color: productVariant ? productVariant.color : null,
                    size: productVariant ? productVariant.size : null,
                    quantity: productVariant ? productVariant.quantity : null,
                    state: productVariant ? productVariant.state : null
                };
            });

            setListProductVariant(productsWithVariants);
            setCurrentPage(1); // Reset to the first page on data fetch
        } catch (err) {
            setError('Failed to fetch product variants or images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentProducts = listProductVariant.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    return (
        <div className="product-manager">
            <Header title="Quản lý sản phẩm" />
            <div className="wrapper manager-box">
                <div className="to-add-product-page">
                    <Button onClick={() => Router.push('/product/create')} type="primary">
                        Thêm sản phẩm
                    </Button>
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
                                        <th title='Tên sản phẩm' className="name col-infor-product">Sản phẩm</th>
                                        <th title='Giá sản phẩm' className="col-price">Giá</th>
                                        {/* <th title="Tồn kho" className="col-quantity">Tồn kho</th> */}
                                        <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                        <th title="Chi tiết" className="col-detail">Chi tiết</th>
                                        <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                                    </tr>
                                </thead>
                                </table>
                                <tbody>
                                    {currentProducts.length ? (
                                        currentProducts.map((productVariant, index) => (
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
                                                refreshProductVariantTable={fetchProductVariants}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}><Empty /></td>
                                        </tr>
                                    )}
                                </tbody>
                            
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={listProductVariant.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                style={{ textAlign: 'center', marginTop: '20px' }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagementPage;
