import { useState } from "react";
import categoryService from "../../services/categoryService";

export default function CreateCategory() {

    const [form, setForm] = useState({
        name: "",
        slug: "",
        isActive: true
    });

    const [loading, setLoading] = useState(false);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/#/g, "sharp");
    };

    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm({
            ...form,
            name: value,
            slug: generateSlug(value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await categoryService.create(form);

            alert("Category Created Successfully");

            setForm({
                name: "",
                slug: "",
                isActive: true
            });

        } catch (error) {
            console.error(error);
            alert("Error creating category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10">

            <div className="bg-white shadow-xl rounded-2xl p-8 border">

                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Create Category
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={handleNameChange}
                            placeholder="Enter category name"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Slug
                        </label>

                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ ...form, slug: e.target.value })
                            }
                            placeholder="category-slug"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between">

                        <span className="text-sm text-gray-600">
                            Active Category
                        </span>

                        <label className="inline-flex items-center cursor-pointer">

                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm({ ...form, isActive: e.target.checked })
                                }
                                className="sr-only peer"
                            />

                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative transition">

                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>

                            </div>

                        </label>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating..." : "Create Category"}
                    </button>

                </form>

            </div>

        </div>
    );
}