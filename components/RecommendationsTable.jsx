import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khnwnznlnzctjlacfrib.supabase.co'; // kendi projenin URL'si
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtobnduem5sbnpjdGpsYWNmcmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTEwNzgsImV4cCI6MjA4MzU2NzA3OH0.kAYxYdggFUMSX1bt7ese8TT-1V5tZNEDdP1zagsBxrg'; // Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RecommendationsTable() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      const { data, error } = await supabase
        .from('similar_product_recommendations')
        .select('*')
        .order('product_name', { ascending: true });

      if (error) console.error('❌ Supabase Error:', error);
      else setRecommendations(data || []);

      setLoading(false);
    };
    loadRecommendations();
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-500">Yükleniyor...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">💡 Ürün Fiyat Karşılaştırma Tablosu</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-b">Ürün Adı</th>
              <th className="py-2 px-4 border-b">Tedarikçi</th>
              <th className="py-2 px-4 border-b">En Düşük Fiyat</th>
              <th className="py-2 px-4 border-b">Ortalama Fiyat</th>
              <th className="py-2 px-4 border-b">En Yüksek Fiyat</th>
              <th className="py-2 px-4 border-b">Toplam Alım</th>
              <th className="py-2 px-4 border-b">Son Satın Alma</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border-b">{r.product_name}</td>
                <td className="py-2 px-4 border-b">{r.supplier_name}</td>
                <td className="py-2 px-4 border-b text-green-600 font-semibold">{r.lowest_unit_price}</td>
                <td className="py-2 px-4 border-b">{r.avg_unit_price.toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-red-500 font-semibold">{r.highest_unit_price}</td>
                <td className="py-2 px-4 border-b">{r.total_purchases}</td>
                <td className="py-2 px-4 border-b">{new Date(r.last_purchased_at).toLocaleString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
