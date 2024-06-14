import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Empty, Spin, Alert, Pagination, Button, Input, InputNumber, Select } from 'antd';
import axios from 'axios';
import { homeAPI } from '@/config';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';

import * as actions from '../../store/actions';

const { Option } = Select;

const ProductManagementPage = () => {
    const [listProductVariant, setListProductVariant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const dispatch = useDispatch();

    // Filter states
    const [filterName, setFilterName] = useState('');
    const [filterPriceRange, setFilterPriceRange] = useState([null, null]);
    const [filterState, setFilterState] = useState(null);

    const fetchProductVariants = useCallback(async () => {
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
                    is_active: productVariant ? productVariant.is_active : null
                };
            });

            setListProductVariant(productsWithVariants);
            setCurrentPage(1); // Reset to the first page on data fetch
        } catch (err) {
            setError('Failed to fetch product variants or images. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductVariants();
    }, [fetchProductVariants]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredProducts = listProductVariant.filter(product => {
        const matchesName = product.name_product.toLowerCase().includes(filterName.toLowerCase());
        const matchesPrice = (
            (!filterPriceRange[0] || product.price >= filterPriceRange[0]) &&
            (!filterPriceRange[1] || product.price <= filterPriceRange[1])
        );
        const matchesState = filterState ? product.is_active === filterState : true;
        return matchesName && matchesPrice && matchesState;
    });

    const currentProducts = filteredProducts.slice(
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
                
                {/* Filters */}
                <div className="filters">
                    <Input
                        placeholder="Tìm kiếm sản phẩm"
                        value={filterName}
                        onChange={e => setFilterName(e.target.value)}
                        style={{ width: 200, marginRight: 10 }}
                    />
                    <InputNumber
                        placeholder="Giá tối thiểu"
                        value={filterPriceRange[0]}
                        onChange={value => setFilterPriceRange([value, filterPriceRange[1]])}
                        style={{ width: 120, marginRight: 10 }}
                    />
                    <InputNumber
                        placeholder="Giá tối đa"
                        value={filterPriceRange[1]}
                        onChange={value => setFilterPriceRange([filterPriceRange[0], value])}
                        style={{ width: 120, marginRight: 10 }}
                    />
                    <Select
                        placeholder="Trạng thái"
                        value={filterState}
                        onChange={value => setFilterState(value)}
                        style={{ width: 150 }}
                    >
                        <Option value="1">Đang hiện</Option>
                        <Option value="0">Đã ẩn</Option>
                    </Select>
                </div>
                
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
                                        <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                        <th title="Trạng thái" className="col-state">Trạng thái</th>
                                        <th title="Chi tiết" className="col-detail">Chi tiết</th>
                                        <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                                    </tr>
                                </thead>
                                </table>
                                
                                    {currentProducts.length ? (
                                        currentProducts.map((productVariant, index) => (
                                            <ProductAdmin
                                                key={index}
                                                product_id={productVariant.id}
                                                product_variant_id={productVariant.id}
                                                product_name={productVariant.name_product}
                                                product_image={productVariant.imageUrl}
                                                colour_name={productVariant.color}
                                                size_name={productVariant.size}
                                                price={productVariant.price}
                                                quantity={productVariant.quantity}
                                                state={productVariant.is_active}
                                                created_at={productVariant.created_at}
                                                refreshProductVariantTable={fetchProductVariants}
                                            />
                                        ))
                                    ) : (
                                        <table>
                                        <tbody>
                                        <tr>
                                            <td colSpan={6}><Empty /></td>
                                        </tr>
                                        </tbody>
                                        </table>
                                    )}
                                
                            
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={filteredProducts.length}
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
