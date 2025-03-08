import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function App() {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const imageUrl = "https://api.fruteacorp.uz/images";
  const token = localStorage.getItem("token");

  useEffect(() => {
    getBanners();
  }, []);

  // Bannerlarni olish
  const getBanners = () => {
    axios
      .get("https://api.fruteacorp.uz/banner")
      .then((res) => {
        if (res.data && res.data.data) {
          setBanners(res.data.data);
        }
      })
      .catch((err) => console.error("🚨 Xatolik:", err));
  };

  // Faylni olish va saqlash
  const handleFile = (e) => {
    const file = e.target.files[0];
    setValue("image", file);
  };

  // Banner qo‘shish yoki tahrirlash
  const onSubmit = (data) => {
    const file = watch("image");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("link", data.link);
    if (file) formData.append("image", file);

    const url = editingBanner
      ? `https://api.fruteacorp.uz/banner/${editingBanner.id}`
      : "https://api.fruteacorp.uz/banner";
    const method = editingBanner ? "PUT" : "POST";

    axios({
      url,
      method,
      data: formData,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        getBanners();
        reset();
        setEditingBanner(null);
      })
      .catch((error) => console.error("🚨 Xatolik:", error.response?.data || error));
  };

  // Banner o‘chirish
  const deleteBanner = (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;

    axios
      .delete(`https://api.fruteacorp.uz/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => getBanners())
      .catch((error) => console.error("🚨 O‘chirishda xatolik:", error.response?.data || error));
  };

  // Tahrirlashni boshlash
  const startEditing = (banner) => {
    setEditingBanner(banner);
    reset({
      title: banner.title,
      link: banner.link,
      image: null, // Eskisini saqlamaslik uchun
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">Bannerlar</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-md w-3/4 mx-auto">
        <input
          type="text"
          {...register("title")}
          placeholder="Sarlavha"
          className="w-3/4 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-400 hover:bg-gray-700 transition duration-300"
        />
        <input
          type="text"
          {...register("link")}
          placeholder="Havola"
          className="w-3/4 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-400 hover:bg-gray-700 transition duration-300"
        />
        <input
          type="file"
          onChange={handleFile}
          className="w-3/4 px-4 py-2 border border-gray-600 rounded-lg cursor-pointer bg-transparent text-white hover:bg-gray-700 transition duration-300"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg font-semibold hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition duration-300"
        >
          {editingBanner ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="border border-gray-600 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 relative bg-gray-800"
            >
              <img
                src={`${imageUrl}/${banner.image}`}
                alt={banner.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-200">{banner.title}</h3>
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 block mt-2"
                >
                  Batafsil →
                </a>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => startEditing(banner)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-yellow-600 hover:shadow-lg transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-red-600 hover:shadow-lg transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Bannerlar yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
}

export default App;
