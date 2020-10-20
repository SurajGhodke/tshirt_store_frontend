import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {
  getCategories,
  getaProduct,
  updateProduct
} from "./helper/adminapicall";
import { isAutheticated } from './../auth/helper/index';

const UpdateProduct = ({ match }) => {

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "" ,
    createdProduct: "",
    getaRedirect: false,
    formData: ""
  });

  const {
    name,
    description,
    price,
    stock,
    error,
    categories,
    category,
    loading,
    createdProduct,
    getaRedirect,
    formData
  } = values;

  const { user, token } = isAutheticated();

  const preload = (productId) => {
    getaProduct(productId).then(data => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        preloadCategories();
        setValues({
          ...values,
          photo: data.photo,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          stock: data.stock,
          formData: new FormData()
        });
      }
    });
  };

  const preloadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          categories: data,
          formData: new FormData()
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  //TODO: work on it
  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, user._id, token, formData).then(
      data => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name
          });
        }
      }
    );
  };

  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

//   const goBack = () => (
//     <div className='mt-5'>
//         <Link className='btn btn-sm btn-dark mb-3' to='/admin/dashboard'>Admin Dashboard</Link>
//     </div>
// )
  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h4>{createdProduct} updated successfully</h4>
    </div>
  );

  const errorMessage = () => {
    return (
        <div className='alert alert-danger mt-3' style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )
}

// const performRedirect = () => {
//     if (getRedirect) {
//         window.setTimeout(() => {
//             window.location.href = '/admin/products'
//         }, 2000)
//     }
// }

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Stock"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;


// import React, { useState, useEffect } from 'react';
// import Base from '../core/Base';
// import { getAllCategories, updateProduct, getAProduct } from './helper/adminapicall';
// import { isAuthenticated } from '../auth/helper';
// import { Link } from 'react-router-dom';

// const UpdateProduct = ({ match }) => {

//     const [values, setValues] = useState({
//         photo: '',
//         name: '',
//         description: '',
//         price: '',
//         categories: [],
//         category: '',
//         stock: '',
//         error: '',
//         loading: false,
//         getRedirect: false,
//         createdProduct: '',
//         formData: ''
//     })

//     const { name, description, price, category, categories, stock, error, getRedirect, createdProduct, formData } = values;

//     const { user, token } = isAuthenticated();

//     const preLoad = (productId) => {
//         getAProduct(productId).then(data => {
//             console.log(data)
//             if (data.error) {
//                 setValues({ ...values, error: data.error })
//             } else {
//                 preLoadCategories()
//                 setValues({
//                     ...values,
//                     photo: data.photo,
//                     name: data.name,
//                     description: data.description,
//                     price: data.price,
//                     category: data.category._id,
//                     stock: data.stock,
//                     formData: new FormData()
//                 })
//             }
//         })
//     }

//     const preLoadCategories = () => {
//         getAllCategories().then(data => {
//             if (data.error) {
//                 setValues({ ...values, error: data.error })
//             } else {
//                 setValues({ categories: data, formData: new FormData() })
//             }
//         })
//     }

//     useEffect(() => {
//         preLoad(match.params.productId)
//     }, [])

//     const handleChange = name => event => {
//         const value = name === 'photo' ? event.target.files[0] : event.target.value
//         formData.set(name, value);
//         setValues({ ...values, error: false, [name]: value })
//     }

//     const onSubmit = event => {
//         event.preventDefault();
//         setValues({ ...values, error: false, loading: true });
//         updateProduct(match.params.productId, user._id, token, formData)
//             .then(data => {
//                 if (data.error) {
//                     setValues({ ...values, error: data.error })
//                 } else {
//                     setValues({
//                         ...values,
//                         photo: '',
//                         name: '',
//                         description: '',
//                         price: '',
//                         category: '',
//                         stock: '',
//                         error: '',
//                         loading: false,
//                         createdProduct: data.name,
                       
//                     })
//                 }
//             })
//     }

//     const goBack = () => (
//         <div className='mt-5'>
//             <Link className='btn btn-sm btn-dark mb-3' to='/admin/dashboard'>Admin Dashboard</Link>
//         </div>
//     )

//     const successMessage = () => {
//         return (
//             <div className='alert alert-success mt-3' style={{ display: createdProduct ? '' : 'none' }}>
//                 {createdProduct} updated successfully
//             </div>
//         )
//     }


//     const errorMessage = () => {
//         return (
//             <div className='alert alert-danger mt-3' style={{ display: error ? '' : 'none' }}>
//                 {error}
//             </div>
//         )
//     }

//     const performRedirect = () => {
//         if (getRedirect) {
//             window.setTimeout(() => {
//                 window.location.href = '/admin/products'
//             }, 2000)
//         }
//     }

//     const updateProductForm = () => (
//         <form className='mt-3'>
//             <span className='text-warning'><h5>Upload a product photo</h5></span>
//             <div className='form-group'>
//                 <label className='btn btn-block btn-warning'>
//                     <input onChange={handleChange('photo')} type='file' className='form-control' accept='image' />
//                 </label>
//             </div>
//             <div className='form-group'>
//                 <input onChange={handleChange('name')} type='text' placeholder='Name' className='form-control' value={name} />
//             </div>
//             <div className='form-group'>
//                 <textarea onChange={handleChange('description')} type='text' placeholder='Description' className='form-control' value={description} />
//             </div>
//             <div className='form-group'>
//                 <input onChange={handleChange('price')} type='number' placeholder='Price' className='form-control' value={price} />
//             </div>
//             <div className='form-group'>
//                 <select onChange={handleChange('category')} placeholder='Category' className='form-control' value={category} >
//                     <option>Select</option>
//                     {categories && categories.map((cate, index) => (
//                         <option key={index} value={cate._id}>{cate.name}</option>
//                     ))
//                     }
//                 </select>
//             </div>
//             <div className='form-group'>
//                 <input onChange={handleChange('stock')} type='number' placeholder='stock' className='form-control' value={stock} />
//             </div>
//             <button onClick={onSubmit} type='submit' className='btn btn-outline-warning mb-3'>Update product</button>
//         </form>
//     )

//     return (
//         <Base title='Update product section :)' description='If you need to you can update your product from here!' className='container p-4'>
//             <div className='row bg-info rounded'>
//                 <div className='col-md-8 offset-md-2'>
//                     {goBack()}
//                     {errorMessage()}
//                     {successMessage()}
//                     {updateProductForm()}
//                     {performRedirect()}
//                 </div>
//             </div>
//         </Base>
//     )
// }

// export default UpdateProduct;
