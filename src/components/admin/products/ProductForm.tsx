"use client";

import { Product, Category, createAdminProduct, updateAdminProduct, uploadAdminImage, getCategories } from "@/core/api";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Link2, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/core/api/client";


interface ProductFormProps {
  initialData?: Product;
}

type ImageInputMode = "upload" | "url";

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceInput, setPriceInput] = useState<string>(initialData?.price?.toString() ?? "");
  const [imageMode, setImageMode] = useState<ImageInputMode>(initialData?.image_url?.startsWith("http") ? "url" : "upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (initialData?.image_url) {
      setPreviewUrl(getFullImageUrl(initialData.image_url));
    }
  }, [initialData]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      slug: "",
      price: 0,
      description: "",
      image_url: "",
      category: "goat-meat", // Use a default from seeded categories
      weight_options: [],
      is_active: true,
    }
  );

  useEffect(() => {
    setMounted(true);
    getCategories().then(setCategories).catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "image_url") {
      setPreviewUrl(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPriceInput(raw);
    const parsed = parseFloat(raw);
    setFormData((prev) => ({ ...prev, price: isNaN(parsed) ? 0 : parsed }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadAdminImage(file);
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
      setPreviewUrl(uploadedUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed.");
      setPreviewUrl("");
      setSelectedFile(null);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    setPreviewUrl("");
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.warning("Please provide an image.");
      return;
    }
    setLoading(true);

    try {
      let savedProduct: Product | undefined;

      if (initialData) {
        savedProduct = await updateAdminProduct(initialData.id, formData);
        toast.success("Product updated successfully!");
      } else {
        const submissionData = { ...formData };
        if (!submissionData.slug && submissionData.name) {
          submissionData.slug = submissionData.name.toLowerCase().replace(/ /g, "-");
        }
        if (!submissionData.weight_options || submissionData.weight_options.length === 0) {
          submissionData.weight_options = ["1kg"];
        }
        savedProduct = await createAdminProduct(submissionData as Omit<Product, "id">);
        toast.success("Product created successfully!");
      }

      if (savedProduct) {
        router.push(`/admin/products/${savedProduct.slug}`);
      } else {
        router.push("/admin/products");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse h-96" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
    >
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Full Goat (Processed)"
          className="border-gray-200 focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price (₦)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={priceInput}
            onChange={handlePriceChange}
            required
            placeholder="0"
            min="0"
            className="border-gray-200 focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3f7a55]/20 focus:border-[#3f7a55] transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
          Slug <span className="text-gray-400 font-normal">(auto-generated if empty)</span>
        </Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="e.g. full-goat-processed"
          className="border-gray-200 font-mono text-sm focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55]"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active ?? true}
          onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
          className="w-4 h-4 text-[#3f7a55] border-gray-300 rounded focus:ring-[#3f7a55] cursor-pointer"
        />
        <Label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
          Active <span className="text-gray-400 font-normal">(Visible to customers)</span>
        </Label>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Describe the product..."
          className="border-gray-200 focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55] resize-none"
        />
      </div>

      <div className="grid gap-3">
        <Label className="text-sm font-medium text-gray-700">Product Image</Label>

        <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit gap-1">
          <button
            type="button"
            onClick={() => setImageMode("upload")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              imageMode === "upload" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              imageMode === "url" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Paste URL
          </button>
        </div>

        {imageMode === "upload" && (
          <div>
            {previewUrl && formData.image_url ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 group">
                <Image src={getFullImageUrl(previewUrl)} alt="Product preview" fill unoptimized className="object-cover" />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <span className="text-white ml-2 text-sm font-medium">Uploading...</span>
                  </div>
                )}
                {!uploadingImage && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragOver ? "border-[#3f7a55] bg-[#3f7a55]/5 scale-[1.01]" : "border-gray-200 bg-gray-50/50 hover:border-[#3f7a55]/50 hover:bg-[#3f7a55]/5"
                }`}
              >
                <div className="flex flex-col items-center gap-2 select-none">
                  <div className="w-10 h-10 rounded-xl bg-[#3f7a55]/10 flex items-center justify-center">
                    <ImagePlus className="w-5 h-5 text-[#3f7a55]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop image here, or <span className="text-[#3f7a55] underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
          </div>
        )}

        {imageMode === "url" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                id="image_url"
                name="image_url"
                value={imageMode === "url" ? (formData.image_url || "") : ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="border-gray-200 focus-visible:ring-[#3f7a55]/30 focus-visible:border-[#3f7a55]"
              />
              {previewUrl && (
                <Button type="button" variant="ghost" onClick={clearImage} className="shrink-0">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {previewUrl && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <Image src={getFullImageUrl(previewUrl)} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={loading}
          className="text-gray-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-[#3f7a55] hover:bg-[#2d583d] text-white min-w-[130px]"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
