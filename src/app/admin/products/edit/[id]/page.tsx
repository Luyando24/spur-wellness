"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, Save, Trash2, Loader2, Plus, Lock } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();

  // Load States
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Form Input States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Kettlebells");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [isWholesale, setIsWholesale] = useState(false);
  const [moqPrice, setMoqPrice] = useState("");
  const [moqQuantity, setMoqQuantity] = useState("10");

  // File Upload States
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);
  const [existingSecondaryImages, setExistingSecondaryImages] = useState<string[]>([]);

  // Force light cream/white background overrides
  useEffect(() => {
    document.documentElement.style.setProperty("--background", "#ffffff");
    document.documentElement.style.setProperty("--foreground", "#171717");
    
    return () => {
      document.documentElement.style.removeProperty("--background");
      document.documentElement.style.removeProperty("--foreground");
    };
  }, []);

  // Fetch product on mount
  useEffect(() => {
    if (!id) return;

    const loadProductData = async () => {
      try {
        setFetching(true);
        setError("");

        const { data, error: dbError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error("Product details could not be found.");

        setName(data.name || "");
        setCategory(data.category || "Kettlebells");
        setPrice(data.price ? String(data.price) : "");
        setStock(data.stock_quantity !== undefined ? String(data.stock_quantity) : "0");
        setImageUrl(data.image || "");
        setDescription(data.description || "");
        setMainImagePreview(data.image || "");
        setExistingSecondaryImages(data.images || []);
        setIsWholesale(data.is_wholesale || false);
        setMoqPrice(data.moq_price ? String(data.moq_price) : "");
        setMoqQuantity(data.moq_quantity !== undefined ? String(data.moq_quantity) : "10");
      } catch (err: any) {
        console.error("Failed to load product details:", err);
        setError(err.message || "Failed to load product details.");
      } finally {
        setFetching(false);
      }
    };

    loadProductData();
  }, [id]);

  // Main Image Change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Secondary Images Addition
  const handleSecondaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSecondaryFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSecondaryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Remove existing catalog secondary image
  const removeExistingSecondaryImage = (index: number) => {
    setExistingSecondaryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove newly uploaded secondary image preview
  const removeNewSecondaryImage = (index: number) => {
    setSecondaryFiles(prev => prev.filter((_, i) => i !== index));
    setSecondaryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Upload helper
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Submit Changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !stock) return;

    try {
      setSaving(true);
      const priceVal = parseFloat(price);
      const stockVal = parseInt(stock);

      if (isNaN(priceVal) || priceVal < 0) {
        throw new Error("Please enter a valid price.");
      }
      if (isNaN(stockVal) || stockVal < 0) {
        throw new Error("Please enter a valid stock level.");
      }

      let moqPriceVal = null;
      let moqQtyVal = 10;
      if (isWholesale) {
        moqPriceVal = parseFloat(moqPrice);
        moqQtyVal = parseInt(moqQuantity);
        if (isNaN(moqPriceVal) || moqPriceVal <= 0) {
          throw new Error("Please enter a valid wholesale MOQ price greater than 0.");
        }
        if (isNaN(moqQtyVal) || moqQtyVal < 1) {
          throw new Error("Please enter a valid wholesale minimum order quantity (at least 1).");
        }
      }

      // 1. Re-upload main image if replaced
      let finalMainImageUrl = imageUrl;
      if (mainImageFile) {
        finalMainImageUrl = await uploadFileToStorage(mainImageFile);
      }

      // 2. Upload any new secondary images
      const newSecondaryUrls: string[] = [];
      if (secondaryFiles.length > 0) {
        for (const file of secondaryFiles) {
          const url = await uploadFileToStorage(file);
          newSecondaryUrls.push(url);
        }
      }

      // Combine remaining existing with newly uploaded secondary URLs
      const combinedSecondaryUrls = [...existingSecondaryImages, ...newSecondaryUrls];

      const updatePayload = {
        name: name.trim(),
        category: category,
        price: priceVal,
        stock_quantity: stockVal,
        image: finalMainImageUrl,
        images: combinedSecondaryUrls,
        description: description.trim(),
        is_wholesale: isWholesale,
        moq_price: moqPriceVal,
        moq_quantity: moqQtyVal
      };

      const { error: updateError } = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", id);

      if (updateError) throw updateError;

      alert("Product updated successfully!");
      router.push("/admin?tab=products");
    } catch (err: any) {
      console.error("Failed to save changes:", err);
      alert(err.message || "Failed to update product details.");
    } finally {
      setSaving(false);
    }
  };

  // Credentials check gate
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-serif text-lg">Verifying credentials...</p>
      </div>
    );
  }

  // Auth Restriction
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-primary/20 rounded-lg shadow-xl overflow-hidden text-center relative">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
          <div className="p-8 space-y-6">
            <div className="h-16 w-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-wider uppercase">Admin Portal Locked</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              This workspace contains financial sales summaries, custom inventory management, and sensitive invoice data. Please sign in to verify your identity.
            </p>
            <Link 
              href={`/login?redirect=/admin/products/edit/${id}`}
              className="block w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary transition-colors text-sm shadow-md uppercase tracking-wider"
            >
              Log In as Administrator
            </Link>
            <div className="pt-4 border-t border-gray-150">
              <Link href="/shop" className="text-xs text-primary hover:underline font-bold">
                Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data fetching fallback
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-serif text-lg">Loading catalog item details...</p>
      </div>
    );
  }

  // Error fetching fallback
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-sm text-center">
          <h2 className="font-serif text-lg font-bold text-red-600 mb-3">Product Load Error</h2>
          <p className="text-xs text-gray-500 mb-6">{error}</p>
          <Link 
            href="/admin?tab=products"
            className="inline-block bg-primary text-white text-xs font-bold py-3 px-6 rounded uppercase tracking-wider shadow hover:bg-secondary"
          >
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin?tab=products"
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full border border-gray-100 transition-all flex items-center justify-center shadow-sm"
              title="Return to inventory"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Spur Wellness Admin</span>
              <h1 className="text-xl font-serif font-bold text-gray-950">Modify Product Listing</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link 
              href="/admin?tab=products"
              className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-bold rounded text-xs transition-all uppercase tracking-wider"
            >
              Discard Changes
            </Link>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Details Section */}
            <div>
              <h3 className="font-serif text-base font-bold text-gray-955 border-b border-gray-100 pb-3 mb-6">
                1. Product Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 shadow-sm"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 cursor-pointer shadow-sm"
                  >
                    <option value="Kettlebells">Kettlebells</option>
                    <option value="Resistance Bands">Resistance Bands</option>
                    <option value="Exercise Balls">Exercise Balls</option>
                    <option value="Exercise Mats">Exercise Mats</option>
                    <option value="Artificial Turf">Artificial Turf</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 shadow-sm"
                  />
                </div>

                {/* Stock Level */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Stock Level *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 shadow-sm"
                  />
                </div>

                {/* Image URL fallback */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Fallback Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 shadow-sm"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-955 resize-none shadow-sm"
                  />
                </div>

                {/* Wholesale Specifications */}
                <div className="md:col-span-2 bg-gray-50/50 p-6 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-955 uppercase tracking-wider mb-1">
                        Wholesale Product Toggler
                      </span>
                      <span className="block text-[10px] text-gray-400">
                        Enable this to mark the product as wholesale with Minimum Order Quantity specifications.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isWholesale}
                        onChange={(e) => setIsWholesale(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {isWholesale && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-250/60 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Wholesale MOQ Price ($ USD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required={isWholesale}
                          value={moqPrice}
                          onChange={(e) => setMoqPrice(e.target.value)}
                          placeholder="89.99"
                          className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-955 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Minimum Order Quantity (MOQ) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required={isWholesale}
                          value={moqQuantity}
                          onChange={(e) => setMoqQuantity(e.target.value)}
                          placeholder="10"
                          className="w-full text-xs border border-gray-300 bg-white rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-955 shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Media Upload Section */}
            <div>
              <h3 className="font-serif text-base font-bold text-gray-955 border-b border-gray-100 pb-3 mb-6">
                2. Product Media & Images
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Main Product Image Zone */}
                <div className="bg-gray-50/50 p-6 border border-gray-200 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-955 uppercase tracking-wider mb-1">
                      Primary Product Cover
                    </span>
                    <span className="block text-[10px] text-gray-400 mb-4">
                      Upload a new image to replace the current display cover.
                    </span>
                  </div>

                  {mainImagePreview ? (
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                      <Image src={mainImagePreview} alt="Main Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="h-6 w-6 text-white mb-2" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Replace Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleMainImageChange} 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-gray-250 hover:border-primary/50 transition-all rounded-xl aspect-[4/5] flex flex-col items-center justify-center bg-white cursor-pointer group shadow-sm">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors mb-3" />
                      <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Upload High-Res Cover</span>
                      <span className="text-[10px] text-gray-400 mt-2">PNG, JPG or WEBP up to 5MB</span>
                    </div>
                  )}
                </div>

                {/* Secondary Gallery Zone */}
                <div className="bg-gray-50/50 p-6 border border-gray-200 rounded-xl flex flex-col">
                  <div>
                    <span className="block text-xs font-bold text-gray-955 uppercase tracking-wider mb-1">
                      Secondary Gallery Views
                    </span>
                    <span className="block text-[10px] text-gray-400 mb-4">
                      Delete current views, or upload new high-density texture/style assets to catalog.
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 flex-1">
                    {/* Render existing secondary images */}
                    {existingSecondaryImages.map((url, idx) => (
                      <div key={`existing-${idx}`} className="aspect-square relative rounded-lg overflow-hidden bg-gray-150 border border-gray-200 group">
                        <Image src={url} alt="Catalog gallery item" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeExistingSecondaryImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold"
                          title="Remove from catalog"
                        >
                          <Trash2 className="h-5 w-5 text-red-400" />
                        </button>
                      </div>
                    ))}

                    {/* Render newly uploaded previews */}
                    {secondaryPreviews.map((url, idx) => (
                      <div key={`new-${idx}`} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border border-primary/20 group">
                        <Image src={url} alt="New gallery item" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeNewSecondaryImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold"
                        >
                          <Trash2 className="h-5 w-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                    
                    {existingSecondaryImages.length + secondaryPreviews.length < 8 && (
                      <div className="aspect-square relative border border-dashed border-gray-255 hover:border-primary/50 transition-all rounded-lg flex flex-col items-center justify-center bg-white cursor-pointer group shadow-sm">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={handleSecondaryImagesChange} 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 mt-2">Add Angle</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Submission triggers */}
            <div className="pt-6 border-t border-gray-100 flex justify-end items-center space-x-4">
              <Link 
                href="/admin?tab=products"
                className="px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition-colors text-xs uppercase tracking-wider"
              >
                Cancel Changes
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white text-xs font-bold py-3.5 px-8 rounded-lg hover:bg-secondary hover:shadow-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50 min-w-[180px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Specifications</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
