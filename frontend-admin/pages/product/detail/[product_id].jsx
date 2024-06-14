import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Spin, Alert, Button, Table, Image } from 'antd';
import { homeAPI } from '@/config';
import { swtoast } from "@/mixins/swal.mixin";

const DetailProductPage = () => {
    const router = useRouter();
    const { product_id } = router.query;
    const [product, setProduct] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [productResult, imagesResult, variantsResult] = await Promise.all([
                axios.get(`${homeAPI}/products/${product_id}`),
                axios.get(`${homeAPI}/product-images/`),
                axios.get(`${homeAPI}/all-variant`)
            ]);

            const product = productResult.data;
            const images = imagesResult.data;
            const variants = variantsResult.data.filter(variant => variant.product_id === parseInt(product_id));

            const variantsWithImages = variants.map(variant => ({
                ...variant,
                images: images.filter(img => img.variant_id === variant.id)
            }));

            setProduct(product);
            setProductVariants(variantsWithImages);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details. Please try again.');
            swtoast.error({ text: 'Error fetching product details. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    }, [product_id]);

    useEffect(() => {
        if (product_id) {
            fetchProductDetails();
        }
    }, [product_id, fetchProductDetails]);

    const columns = [
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Sale Price',
            dataIndex: 'price_sale',
            key: 'price_sale',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'SKU',
            dataIndex: 'SKU',
            key: 'SKU',
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: is_active => (is_active ? 'Yes' : 'No')
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            render: images => (
                <div>
                    {images.map(image => (
                        <Image key={image.id} src={image.url} width={50} />
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="detail-product-page">
            {isLoading ? (
                <Spin tip="Loading...">
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                </Spin>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : product ? (
                <div className="product-details">
                    <h2>{product.name_product}</h2>
                    <p>Description: {product.description}</p>
                    <p>Category: {product.categoryID}</p>
                    {/* Render other product details */}

                    <div className="product-variants">
                        <h3>Product Variants</h3>
                        <Table
                            dataSource={productVariants}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                        />
                    </div>
                    <Button onClick={() => router.push('/product/manage')} type="primary">
                        Back to Product Management
                    </Button>
                </div>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
};

export default DetailProductPage;
