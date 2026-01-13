
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from './supabaseClient';

import { 
  LayoutDashboard, 
  Box, 
  Users, 
  ShoppingCart, 
  FileText, 
  LogOut, 
  ChefHat, 
  Utensils, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  TrendingDown,
  Phone,
  Search,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Package
} from 'lucide-react';
import { 
  UserType, 
  Product, 
  Supplier, 
  PurchaseRequest, 
  RequestStatus, 
  UNITS, 
  SERVICE_AREAS, 
  PriceHistory 
} from './types';

// Mock DB Initial State
const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_SUPPLIERS: Supplier[] = [];
const INITIAL_REQUESTS: PurchaseRequest[] = [];

const App: React.FC = () => {
    // 🔌 Supabase bağlantı testi (SADECE OKUMA)
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      if (error) {
        console.error('❌ Supabase bağlantı hatası:', error.message);
      } else {
        console.log('✅ Supabase bağlantısı OK. Products:', data);
      }
    };

    testSupabase();
  }, []);

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'suppliers' | 'requests' | 'procurement'>('dashboard');
  
  const [products, setProducts] = useState<Product[]>([]);
useEffect(() => {
  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ürünler yüklenemedi:', error);
      return;
    }

    const mapped: Product[] = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      createdAt: p.created_at
    }));

    setProducts(mapped);
  };

  loadProducts();
}, []);



  
  
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);


  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

useEffect(() => {
  const loadSuppliers = async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Tedarikçiler yüklenemedi:', error.message);
      return;
    }

    setSuppliers(
      (data || []).map((s: any) => ({
        id: s.id,
        companyName: s.company_name,
        phone: s.phone,
        contactPerson: s.contact_person,
        email: s.email,
        address: s.address,
        serviceAreas: s.service_areas || [],
        createdAt: s.created_at
      }))
    );
  };

  loadSuppliers();
}, []);





  // Security check: If MUTFAK tries to access procurement, redirect to dashboard
  useEffect(() => {
    if (currentUser === 'MUTFAK' && activeTab === 'procurement') {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const handleLogout = () => setCurrentUser(null);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
        <div className="p-6 flex flex-col items-center border-b border-slate-100">
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <ChefHat size={32} />
            <Utensils size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-slate-900">DURU</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">{currentUser}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Panel" 
            active={activeTab === 'dashboard'} 
            activeColor="bg-indigo-600"
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Box size={20} />} 
            label="Ürün Kartları" 
            active={activeTab === 'products'} 
            activeColor="bg-amber-500"
            onClick={() => setActiveTab('products')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Tedarikçi Kartları" 
            active={activeTab === 'suppliers'} 
            activeColor="bg-violet-600"
            onClick={() => setActiveTab('suppliers')} 
          />
          <NavItem 
            icon={<FileText size={20} />} 
            label="Talep Ekranı" 
            active={activeTab === 'requests'} 
            activeColor="bg-rose-600"
            onClick={() => setActiveTab('requests')} 
          />
          {currentUser === 'SATINALMA' && (
            <NavItem 
              icon={<ShoppingCart size={20} />} 
              label="Satınalma" 
              active={activeTab === 'procurement'} 
              activeColor="bg-emerald-600"
              onClick={() => setActiveTab('procurement')} 
            />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {activeTab === 'dashboard' && (
          <Dashboard 
            products={products} 
            suppliers={suppliers} 
            requests={requests} 
          />
        )}
        {activeTab === 'products' && (
          <ProductManager 
            products={products} 
            setProducts={setProducts} 
          />
        )}
        {activeTab === 'suppliers' && (
          <SupplierManager 
            suppliers={suppliers} 
            setSuppliers={setSuppliers} 
          />
        )}
        {activeTab === 'requests' && (
          <RequestManager 
            requests={requests} 
            setRequests={setRequests} 
            products={products} 
            suppliers={suppliers}
          />
        )}
        {activeTab === 'procurement' && currentUser === 'SATINALMA' && (
          <ProcurementManager 
            requests={requests} 
            suppliers={suppliers}
            products={products}
          />
        )}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, activeColor: string, onClick: () => void }> = ({ icon, label, active, activeColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
      active 
        ? `${activeColor} text-white shadow-lg` 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-white' : ''}>{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const Login: React.FC<{ onLogin: (u: UserType) => void }> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handlePinInput = (digit: string) => {
    if (isLocked) return;
    if (pin.length < 4) setPin(p => p + digit);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedUser || isLocked) return;
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUser, pin, isLocked]);

  useEffect(() => {
    if (pin.length === 4 && selectedUser) {
      const correctPin = selectedUser === 'SATINALMA' ? '1457' : '0000';
      if (pin === correctPin) {
        onLogin(selectedUser);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setPin('');
        if (nextAttempts >= 5) {
          setIsLocked(true);
          alert('Güvenlik nedeniyle erişim kilitlendi! 5 kez hatalı giriş yapıldı.');
        } else {
          alert(`Hatalı Şifre! Kalan deneme hakkınız: ${5 - nextAttempts}`);
        }
      }
    }
  }, [pin, onLogin, selectedUser, failedAttempts]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="bg-slate-50 p-12 rounded-[2rem] shadow-2xl border border-slate-200 text-center max-w-md w-full">
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">DURU</h1>
          <div className="flex items-center justify-center space-x-3 text-indigo-600 mb-12">
            <ChefHat size={60} strokeWidth={1.5} />
            <Utensils size={48} strokeWidth={1.5} />
          </div>
          <p className="text-slate-500 mb-8 font-semibold uppercase tracking-widest">Kullanıcı Seçimi</p>
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedUser('SATINALMA')}
              className="w-full py-5 px-6 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 transition-all font-bold text-xl active:scale-95"
            >
              SATINALMA
            </button>
            <button 
              onClick={() => setSelectedUser('MUTFAK')}
              className="w-full py-5 px-6 bg-white hover:bg-indigo-600 hover:text-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 transition-all font-bold text-xl active:scale-95"
            >
              MUTFAK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-slate-50 p-8 rounded-[2rem] shadow-2xl border border-slate-200 text-center max-w-xs w-full">
        <button 
          onClick={() => { setSelectedUser(null); setPin(''); setFailedAttempts(0); setIsLocked(false); }} 
          className="text-slate-400 hover:text-slate-900 mb-6 text-sm font-bold"
        >
          ← GERİ DÖN
        </button>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">DURU</h2>
        <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-4">
            <ChefHat size={40} strokeWidth={1.5} />
            <Utensils size={32} strokeWidth={1.5} />
        </div>
        <p className="text-xs text-indigo-600 mb-8 uppercase font-black tracking-[0.2em]">{selectedUser}</p>
        <div className="flex justify-center space-x-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 border-indigo-600 transition-all ${
                pin.length > i ? 'bg-indigo-600 scale-125' : 'bg-transparent'
              }`} 
            />
          ))}
        </div>
        {isLocked ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase mb-4 animate-pulse">
            Erişim Engellendi (5 Hatalı Giriş)
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button 
                key={n} 
                onClick={() => handlePinInput(n.toString())}
                className="h-16 bg-white hover:bg-indigo-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-700 transition-all active:scale-90 shadow-sm"
              >
                {n}
              </button>
            ))}
            <div />
            <button 
              onClick={() => handlePinInput('0')}
              className="h-16 bg-white hover:bg-indigo-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-700 transition-all active:scale-90 shadow-sm"
            >
              0
            </button>
            <button 
              onClick={() => setPin(prev => prev.slice(0, -1))}
              className="h-16 text-rose-500 hover:text-rose-600 font-black transition-all text-sm uppercase"
            >
              SİL
            </button>
          </div>
        )}
        {!isLocked && failedAttempts > 0 && (
          <p className="mt-6 text-[10px] text-rose-500 font-bold uppercase tracking-widest">
            Kalan Deneme: {5 - failedAttempts}
          </p>
        )}
        <p className="mt-4 text-[9px] text-slate-400 font-medium">Şifrenizi klavyeden de girebilirsiniz.</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ products: Product[], suppliers: Supplier[], requests: PurchaseRequest[] }> = ({ products, suppliers, requests }) => {
  const pendingCount = requests.filter(r => r.status === RequestStatus.PENDING).length;
  const orderedCount = requests.filter(r => r.status === RequestStatus.ORDERED).length;

  return (
    <div>
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Genel Bakış</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Ürün" value={products.length} icon={<Box className="text-blue-500" />} bgColor="bg-blue-50" />
        <StatCard title="Tedarikçi Sayısı" value={suppliers.length} icon={<Users className="text-purple-500" />} bgColor="bg-purple-50" />
        <StatCard title="Bekleyen Talepler" value={pendingCount} icon={<FileText className="text-amber-500" />} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard title="Siparişi Verilenler" value={orderedCount} icon={<ShoppingCart className="text-emerald-500" />} color="text-emerald-600" bgColor="bg-emerald-50" />
      </div>

      <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Son İşlemler</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                <th className="pb-4">Zaman</th>
                <th className="pb-4">Ürün</th>
                <th className="pb-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.slice(0, 5).map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm text-slate-500">{new Date(req.timestamp).toLocaleString('tr-TR')}</td>
                  <td className="py-4 font-bold text-slate-800">{req.productName}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      req.status === RequestStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      req.status === RequestStatus.ORDERED ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">Henüz bir işlem bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: number, icon: React.ReactNode, bgColor: string, color?: string }> = ({ title, value, icon, bgColor, color = "text-slate-900" }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-4xl font-black ${color}`}>{value}</h3>
    </div>
    <div className={`p-4 ${bgColor} rounded-2xl`}>{icon}</div>
  </div>
);

const ProductManager: React.FC<{ products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> }> = ({ products, setProducts }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSaveProduct = async () => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    alert("Lütfen ürün adını giriniz.");
    return;
  }

  const exists = products.some(
    p => p.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== editingId
  );
  if (exists) {
    alert(`"${trimmedName}" isimli bir ürün zaten mevcut!`);
    return;
  }

  if (editingId) {
    // UPDATE
    const { error } = await supabase
      .from('products')
      .update({ name: trimmedName, unit })
      .eq('id', editingId);

    if (error) {
      alert('Ürün güncellenemedi');
      return;
    }
  } else {
    // INSERT
    const { error } = await supabase
      .from('products')
      .insert([{ name: trimmedName, unit }]);

    if (error) {
      alert('Ürün eklenemedi');
      return;
    }
  }

  // Supabase’ten tekrar çek
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (!error && data) {
    setProducts(
      data.map((p: any) => ({
        id: p.id,
        name: p.name,
        unit: p.unit,
        createdAt: p.created_at
      }))
    );
  }

  setName('');
  setUnit(UNITS[0]);
  setEditingId(null);
};

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setUnit(p.unit);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteProduct = async (id: string) => {
  if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Ürün silinemedi');
    return;
  }

  // Supabase’ten tekrar çek
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  setProducts(
    (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      createdAt: p.created_at
    }))
  );

  if (editingId === id) {
    setEditingId(null);
    setName('');
    setUnit(UNITS[0]);
  }
};


  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setUnit(UNITS[0]);
  };

  return (
    <div>
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
        {editingId ? 'Ürün Bilgilerini Güncelle' : 'Ürün Kartları'}
      </h2>
      <div ref={formRef} className={`bg-white p-6 rounded-2xl border ${editingId ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200'} mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-end transition-all`}>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Adı</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium" 
            placeholder="Örn: Domates"
          />
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim</label>
          <select 
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium"
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {editingId && (
            <button 
              onClick={handleCancel}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold p-3 px-6 rounded-xl flex items-center space-x-2 transition-all shadow-sm"
            >
              <X size={20} />
              <span>Vazgeç</span>
            </button>
          )}
          <button 
            onClick={handleSaveProduct}
            className={`${editingId ? 'bg-amber-600' : 'bg-amber-500 hover:bg-amber-600'} text-white font-bold p-3 px-6 rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-amber-200`}
          >
            {editingId ? <Save size={20} /> : <Plus size={20} />}
            <span>{editingId ? 'Güncelle' : 'Ekle'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className={`bg-white p-5 rounded-2xl border flex justify-between items-center group transition-all shadow-sm ${editingId === p.id ? 'border-amber-500 bg-amber-50/20 shadow-inner' : 'border-slate-200 hover:border-amber-400'}`}>
            <div>
              <h4 className="font-bold text-lg text-slate-900">{p.name}</h4>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Birim: {p.unit}</p>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(p)} className="text-slate-400 hover:text-indigo-600 p-2 transition-colors" title="Düzenle"><Edit size={18} /></button>
              <button onClick={() => deleteProduct(p.id)} className="text-slate-400 hover:text-rose-500 p-2 transition-colors" title="Sil"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SupplierManager: React.FC<{ suppliers: Supplier[], setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>> }> = ({ suppliers, setSuppliers }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({ companyName: '', phone: '', contactPerson: '', email: '', address: '', serviceAreas: [] });

  const toggleArea = (area: string) => {
    const areas = formData.serviceAreas || [];
    setFormData({ ...formData, serviceAreas: areas.includes(area) ? areas.filter(a => a !== area) : [...areas, area] });
  };

  const handleSaveSupplier = async () => {
  const trimmedCompanyName = formData.companyName?.trim();
  if (!trimmedCompanyName) {
    alert("Lütfen firma adını giriniz.");
    return;
  }

  const exists = suppliers.some(
    s =>
      s.companyName.toLowerCase() === trimmedCompanyName.toLowerCase() &&
      s.id !== editingId
  );

  if (exists) {
    alert(`"${trimmedCompanyName}" isimli bir tedarikçi zaten mevcut!`);
    return;
  }

  if (editingId) {
    // UPDATE
    const { error } = await supabase
      .from('suppliers')
      .update({
        company_name: trimmedCompanyName,
        phone: formData.phone,
        contact_person: formData.contactPerson,
        email: formData.email,
        address: formData.address,
        service_areas: formData.serviceAreas
      })
      .eq('id', editingId);

    if (error) {
      console.error(error);
      alert('Tedarikçi güncellenemedi');
      return;
    }
  } else {
    // INSERT
    const { error } = await supabase
      .from('suppliers')
      .insert([{
        company_name: trimmedCompanyName,
        phone: formData.phone,
        contact_person: formData.contactPerson,
        email: formData.email,
        address: formData.address,
        service_areas: formData.serviceAreas
      }]);

    if (error) {
      console.error(error);
      alert('Tedarikçi eklenemedi');
      return;
    }
  }

  // 🔄 Supabase’ten yeniden çek
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (!error && data) {
    setSuppliers(
      data.map((s: any) => ({
        id: s.id,
        companyName: s.company_name,
        phone: s.phone,
        contactPerson: s.contact_person,
        email: s.email,
        address: s.address,
        serviceAreas: s.service_areas || [],
        createdAt: s.created_at
      }))
    );
  }

  setFormData({
    companyName: '',
    phone: '',
    contactPerson: '',
    email: '',
    address: '',
    serviceAreas: []
  });
  setEditingId(null);
};


  const handleEdit = (s: Supplier) => { setEditingId(s.id); setFormData(s); formRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const handleDelete = (id: string) => {
    if (confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      if (editingId === id) { setEditingId(null); setFormData({ companyName: '', phone: '', contactPerson: '', email: '', address: '', serviceAreas: [] }); }
    }
  };
  const handleCancel = () => { setEditingId(null); setFormData({ companyName: '', phone: '', contactPerson: '', email: '', address: '', serviceAreas: [] }); };

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={formRef}>
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{editingId ? 'Tedarikçi Bilgilerini Güncelle' : 'Tedarikçi Kartları'}</h2>
        <div className={`bg-white p-8 rounded-2xl border ${editingId ? 'border-violet-500 ring-2 ring-violet-100' : 'border-slate-200'} mb-12 space-y-6 shadow-sm transition-all`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Firma Adı</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 font-medium" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Örn: ABC Gıda Ltd." /></div>
            <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Telefon</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Muhatap Kişi</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 font-medium" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">E-Posta</label><input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Açık Adres</label><textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 font-medium h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hizmet Alanı</label><div className="flex flex-wrap gap-2">{SERVICE_AREAS.map(area => (<button key={area} onClick={() => toggleArea(area)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${formData.serviceAreas?.includes(area) ? 'bg-violet-600 border-violet-400 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'}`}>{area}</button>))}</div></div>
          <div className="flex gap-4">{editingId && (<button onClick={handleCancel} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-2"><X size={20} /><span>Vazgeç</span></button>)}<button onClick={handleSaveSupplier} className={`flex-[2] ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-100'} text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2`}>{editingId ? <Save size={24} /> : <Plus size={24} />}<span>{editingId ? 'Değişiklikleri Kaydet' : 'Tedarikçiyi Sisteme Kaydet'}</span></button></div>
        </div>
      </div>
      <div className="space-y-4">{suppliers.map(s => (<div key={s.id} className={`bg-white p-6 rounded-2xl border flex flex-col md:flex-row justify-between gap-4 shadow-sm hover:border-violet-300 transition-all ${editingId === s.id ? 'border-violet-500 bg-violet-50/20' : 'border-slate-200'}`}><div className="flex-1"><h3 className="text-xl font-black text-slate-900 mb-1">{s.companyName}</h3><p className="text-slate-500 text-sm mb-3">{s.address}</p><div className="flex flex-wrap gap-2">{s.serviceAreas.map(area => (<span key={area} className="px-2 py-1 bg-violet-50 text-violet-600 text-[9px] uppercase font-black rounded border border-violet-100">{area}</span>))}</div></div><div className="flex flex-col md:items-end justify-center space-y-4"><div className="text-right"><p className="text-sm font-black text-violet-600">{s.phone}</p><p className="text-xs text-slate-500 font-bold">{s.contactPerson}</p><p className="text-xs text-slate-400">{s.email}</p></div><div className="flex space-x-2"><button onClick={() => handleEdit(s)} className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-black uppercase transition-all border border-indigo-100"><Edit size={14} /><span>DÜZENLE</span></button><button onClick={() => handleDelete(s.id)} className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-black uppercase transition-all border border-rose-100"><Trash2 size={14} /><span>SİL</span></button></div></div></div>))}</div>
    </div>
  );
};


const RequestManager: React.FC<{ 
  requests: PurchaseRequest[], 
  setRequests: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>,
  products: Product[],
  suppliers: Supplier[]
}> = ({ requests, setRequests, products, suppliers }) => {
useEffect(() => {
  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Talepler yüklenemedi:', error.message);
      return;
    }

    setRequests(
      (data || []).map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        productName: r.product_name,
        amount: r.quantity,
        brand: r.brand,
        specs: r.feature,
        note: r.note,
        status: r.status,
        timestamp: r.created_at
      }))
    );
  };

  loadRequests();
}, []);
const reloadRequests = async () => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Talepler yeniden yüklenemedi:', error.message);
    return;
  }

  setRequests(
    (data || []).map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name,
      amount: r.quantity,
      brand: r.brand,
      specs: r.feature,
      note: r.note,
      status: r.status,
      timestamp: r.created_at
    }))
  );
};

  const [showReceiveModal, setShowReceiveModal] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);
  const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
    productId: '',
    amount: 1,
    brand: '',
    specs: '',
    note: ''
  });

  // ❌ burada artık Supabase SELECT YOK



  const handleSaveRequest = async () => {


  const product = products.find(p => p.id === formData.productId);
  if (!product) return;

  if (editingRequest) {
    // GÜNCELLEME (UPDATE)
    const { error } = await supabase
      .from('requests')
      .update({
        product_id: formData.productId,
        product_name: product.name,
        quantity: formData.amount,
        brand: formData.brand,
        feature: formData.specs,
        note: formData.note,
        status: editingRequest.status
      })
      .eq('id', editingRequest.id);

    if (error) {
      alert('Talep güncellenemedi: ' + error.message);
      return;
    }

    alert('Talep başarıyla güncellendi.');
  } else {
    // YENİ TALEP (INSERT)
    const { error } = await supabase
      .from('requests')
      .insert([
        {
          product_id: formData.productId,
          product_name: product.name,
          quantity: formData.amount,
          brand: formData.brand,
          feature: formData.specs,
          note: formData.note,
          status: 'Beklemede'
        }
      ]);

    if (error) {
      alert('Talep eklenemedi: ' + error.message);
      return;
    }

    alert('Yeni talep başarıyla kaydedildi.');
  }

  // ✅ Supabase’ten verileri tekrar yükle
  

  // ✅ SADECE LOCAL STATE

};



  

  const startEdit = (req: PurchaseRequest) => { setEditingRequest(req); setFormData({ productId: req.productId, amount: req.amount, brand: req.brand, specs: req.specs, note: req.note }); };
  const updateStatus = async (id: string, newStatus: RequestStatus) => {
  if (newStatus === RequestStatus.RECEIVED) {
    setShowReceiveModal(id);
    return;
  }

  const { error } = await supabase
    .from('requests')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    alert('Durum güncellenemedi: ' + error.message);
    return;
  }

  setRequests(prev =>
    prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
  );
};

  const deleteRequest = async (id: string) => {
  if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return;

  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Talep silinemedi: ' + error.message);
    return;
  }

  setRequests(prev => prev.filter(r => r.id !== id));
};


  return (
    <div>
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{editingRequest ? 'Talebi Güncelle' : 'Talep Ekranı'}</h2>
      <div className={`bg-white p-6 rounded-2xl border ${editingRequest ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200'} mb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end shadow-sm transition-all`}>
        <div className="space-y-2 lg:col-span-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Seçimi</label>
          <select 
            value={formData.productId} 
            onChange={e => setFormData({...formData, productId: e.target.value})} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium"
          >
            <option value="">Seçiniz...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>)}
          </select>
        </div>
        <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Miktar</label><input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium" /></div>
        <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Marka</label><input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium" /></div>
        <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Özellik</label><input value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium" /></div>
        <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Not</label><input value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium" /></div>
        <div className="flex gap-2">{editingRequest && (<button onClick={() => { setEditingRequest(null); setFormData({ productId: '', amount: 1, brand: '', specs: '', note: '' }); }} className="bg-white border border-slate-200 p-3 rounded-xl text-slate-400 hover:bg-slate-50 transition-all"><X size={20} /></button>)}<button onClick={handleSaveRequest} className="bg-rose-600 hover:bg-rose-700 text-white font-black h-12 flex-1 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-100 transition-all">{editingRequest ? <Save size={20} /> : <Plus size={20} />}<span>{editingRequest ? 'Güncelle' : 'Talep Oluştur'}</span></button></div>
      </div>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm hover:border-rose-200 transition-all">
            <div className="flex-1"><div className="flex items-center space-x-3 mb-2"><h4 className="font-black text-xl text-slate-900">{req.productName}</h4><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${req.status === RequestStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-200' : req.status === RequestStatus.ORDERED ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>{req.status}</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider"><div><span className="text-slate-300">Miktar:</span> {req.amount}</div><div><span className="text-slate-300">Marka:</span> {req.brand || '-'}</div><div><span className="text-slate-300">Özellik:</span> {req.specs || '-'}</div><div><span className="text-slate-300">Zaman:</span> {new Date(req.timestamp).toLocaleString('tr-TR')}</div></div>{req.note && <p className="mt-2 text-sm text-slate-400 italic font-medium">"{req.note}"</p>}</div>
            <div className="flex items-center space-x-2">
              {req.status === RequestStatus.PENDING && (<><button onClick={() => startEdit(req)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit size={20} /></button><button onClick={() => updateStatus(req.id, RequestStatus.ORDERED)} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-blue-50">Onayla (Sipariş)</button></>)}
              {req.status === RequestStatus.ORDERED && (<button onClick={() => updateStatus(req.id, RequestStatus.RECEIVED)} className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-emerald-50">Teslim Alındı</button>)}
              <button onClick={() => deleteRequest(req.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
      {showReceiveModal && (<ReceivedModal requestId={showReceiveModal} suppliers={suppliers} request={requests.find(r => r.id === showReceiveModal)!} onClose={() => setShowReceiveModal(null)} onConfirm={(details) => { setRequests(prev => prev.map(r => r.id === showReceiveModal ? { ...r, status: RequestStatus.RECEIVED, receivedDetails: details } : r)); setShowReceiveModal(null); }} />)}
    </div>
  );
};

const ReceivedModal: React.FC<{ requestId: string, suppliers: Supplier[], request: PurchaseRequest, onClose: () => void, onConfirm: (details: NonNullable<PurchaseRequest['receivedDetails']>) => void }> = ({ suppliers, request, onClose, onConfirm }) => {
  const [supplierId, setSupplierId] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [vat, setVat] = useState<number>(1);
  const totalExclVat = unitPrice * request.amount;
  const totalInclVat = totalExclVat * (1 + vat/100);
  const handleSave = async () => {
  if (!supplierId || unitPrice <= 0) {
    alert('Lütfen geçerli bilgileri giriniz.');
    return;
  }

  const supplier = suppliers.find(s => s.id === supplierId);
  if (!supplier) {
    alert('Tedarikçi bulunamadı');
    return;
  }

  // 1️⃣ requests → status = RECEIVED
  const { error: updateError } = await supabase
    .from('requests')
    .update({ status: 'Teslim Alındı' })
    .eq('id', request.id);

  if (updateError) {
    alert('Talep güncellenemedi: ' + updateError.message);
    return;
  }

  // 2️⃣ purchase_history → INSERT
  const { error: insertError } = await supabase
    .from('purchase_history')
    .insert([
      {
        request_id: request.id,              // bigint
        product_id: request.productId,       // uuid
        supplier_id: supplier.id,             // uuid

        product_name: request.productName,
        supplier_name: supplier.companyName,

        unit_price: unitPrice,
        quantity: request.amount,

        purchased_at: new Date().toISOString()
      }
    ]);

  if (insertError) {
    alert('Satın alma geçmişi kaydedilemedi: ' + insertError.message);
    return;
  }

  // 3️⃣ UI state güncelle
  onConfirm({
    supplierId: supplier.id,
    supplierName: supplier.companyName,
    unitPrice,
    vatPercent: vat,
    totalExclVat,
    totalInclVat,
    date: new Date().toISOString()
  });
};

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-50 bg-emerald-50/50"><h3 className="text-2xl font-black text-emerald-700 tracking-tight">Teslimat Detayları</h3><p className="text-emerald-600 text-xs font-bold mt-1 uppercase tracking-widest">{request.productName} • {request.amount} BİRİM</p></div>
        <div className="p-8 space-y-6">
          <div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tedarikçi</label><select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none font-bold"><option value="">Seçiniz...</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat</label><input type="number" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none font-bold" /></div><div className="space-y-2"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">KDV (%)</label><input type="number" value={vat} onChange={e => setVat(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none font-bold" /></div></div>
          <div className="bg-slate-50 p-6 rounded-2xl space-y-3"><div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>Ara Toplam</span><span>{totalExclVat.toFixed(2)} TL</span></div><div className="flex justify-between text-xl border-t border-slate-200 pt-3"><span className="text-slate-400 font-black tracking-tighter uppercase">Genel Toplam</span><span className="text-emerald-600 font-black">{totalInclVat.toFixed(2)} TL</span></div></div>
        </div>
        <div className="p-8 flex space-x-3 bg-slate-50/50"><button onClick={onClose} className="flex-1 p-4 bg-white hover:bg-slate-100 rounded-xl font-black text-slate-400 transition-all uppercase text-xs border border-slate-200">İptal</button><button onClick={handleSave} className="flex-1 p-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black text-white transition-all shadow-lg shadow-emerald-100 uppercase text-xs">Kaydet</button></div>
      </div>
    </div>
  );
};

const ProcurementManager: React.FC<{ 
  requests: PurchaseRequest[], 
  suppliers: Supplier[], 
  products: Product[] 
}> = ({ requests, suppliers, products }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
useEffect(() => {
  const loadRecommendations = async () => {
    const { data, error } = await supabase
      .from('similar_product_recommendations')
      .select('*');

    if (error) {
      console.error('❌ Recommendation load error:', error);
    } else {
      console.log('✅ Recommendations:', data);
      setRecommendations(data || []);
    }
  };

  loadRecommendations();
}, []);

  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set());

  const pendingRequests = useMemo(() => requests.filter(r => r.status === RequestStatus.PENDING), [requests]);

  const findCheapestOffer = (productId: string) => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const relevantReceived = requests.filter(r => r.status === RequestStatus.RECEIVED && r.productId === productId && r.receivedDetails && new Date(r.receivedDetails.date) >= fifteenDaysAgo);
    if (relevantReceived.length === 0) return null;
    relevantReceived.sort((a, b) => (a.receivedDetails?.unitPrice || 0) - (b.receivedDetails?.unitPrice || 0));
    const best = relevantReceived[0];
    const supplier = suppliers.find(s => s.id === best.receivedDetails?.supplierId);
    return { price: best.receivedDetails?.unitPrice || 0, supplierId: supplier?.id || '', supplierName: best.receivedDetails?.supplierName || '-', supplierPhone: supplier?.phone || '-', supplierEmail: supplier?.email || '', date: best.receivedDetails?.date || '' };
  };

  // Grouping requests by suggested supplier
  const groupedBySupplier = useMemo(() => {
    const groups: Record<string, { supplier: any, requests: PurchaseRequest[] }> = {};
    const unassigned: PurchaseRequest[] = [];

    pendingRequests.forEach(req => {
      const cheapest = findCheapestOffer(req.productId);
      if (cheapest && cheapest.supplierId) {
        if (!groups[cheapest.supplierId]) {
          groups[cheapest.supplierId] = { supplier: cheapest, requests: [] };
        }
        groups[cheapest.supplierId].requests.push(req);
      } else {
        unassigned.push(req);
      }
    });

    return { groups, unassigned };
  }, [pendingRequests, requests]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedSuppliers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSuppliers(next);
  };

  const handleWhatsApp = (group: any) => {
    const message = `DURU Sipariş Listesi:\n\n` + group.requests.map((r: any) => `- ${r.productName} (${r.amount} adet) ${r.brand ? '['+r.brand+']' : ''}`).join('\n');
    const phone = group.supplier.supplierPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = (group: any) => {
    const body = `Sayın Yetkili,\n\nAşağıdaki ürünler için sipariş oluşturmak istiyoruz:\n\n` + group.requests.map((r: any) => `- ${r.productName}: ${r.amount} adet ${r.brand ? '(Marka: '+r.brand+')' : ''}`).join('\n') + `\n\nİyi çalışmalar.`;
    window.open(`mailto:${group.supplier.supplierEmail}?subject=DURU Sipariş Talebi&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Satınalma Analizi</h2><p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest font-mono">En Ucuz Tedarikçi Eşleştirmeli Dinamik Liste</p></div>
        <div className="bg-emerald-50 px-6 py-4 rounded-[2rem] border border-emerald-100 flex items-center space-x-4 shadow-sm"><TrendingDown className="text-emerald-600" size={32} /><span className="text-emerald-800 font-black text-sm uppercase tracking-widest leading-none">Maliyet Verimliliği<br/><span className="text-[10px] font-bold text-emerald-500">Maksimum Tasarruf</span></span></div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedBySupplier.groups).map(([id, group]: [string, any]) => (
          <div key={id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all">
            {/* Supplier Header - Büyütülmüş ve Belirginleştirilmiş */}
            <div 
              onClick={() => toggleExpand(id)}
              className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors gap-6"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-emerald-600 p-5 rounded-[2rem] text-white shadow-lg shadow-emerald-200"><Users size={32} strokeWidth={2.5} /></div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{group.supplier.supplierName}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-200">
                      {group.requests.length} BEKLEYEN ÜRÜN
                    </span>
                    <span className="text-slate-300 text-xs font-bold">|</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tedarikçi Grubu</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="flex-1 md:flex-none flex flex-col items-end border-r border-slate-100 pr-8">
                  <div className="flex items-center text-lg font-black text-slate-700 space-x-2"><Phone size={18} className="text-emerald-500"/> <span>{group.supplier.supplierPhone}</span></div>
                  <div className="flex items-center text-sm font-bold text-slate-400 space-x-2"><Mail size={16} className="text-indigo-400"/> <span>{group.supplier.supplierEmail}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); handleWhatsApp(group); }} className="w-14 h-14 bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[1.5rem] transition-all flex items-center justify-center shadow-md active:scale-95"><MessageCircle size={28}/></button>
                  <button onClick={(e) => { e.stopPropagation(); handleEmail(group); }} className="w-14 h-14 bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-[1.5rem] transition-all flex items-center justify-center shadow-md active:scale-95"><Mail size={28}/></button>
                  <div className="ml-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    {expandedSuppliers.has(id) ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Request List - Karakteristik Tipografi */}
            {expandedSuppliers.has(id) && (
              <div className="px-8 pb-10 pt-2 space-y-4 bg-slate-50/30 border-t border-slate-100">
                <div className="ml-2 mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sipariş Edilecek Ürün Detayları</h4>
                </div>
                {group.requests.map((req: any) => (
                  <div key={req.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 flex items-center justify-between shadow-sm hover:border-emerald-300 transition-all group/item">
                    <div className="flex items-center space-x-8">
                      <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center group-hover/item:border-emerald-200 transition-colors">
                        <span className="text-2xl font-black text-slate-900 leading-none">{req.amount}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-1">MİKTAR</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1 group-hover/item:text-emerald-700 transition-colors">{req.productName}</h4>
                        <div className="flex items-center space-x-3">
                          <Package size={14} className="text-slate-300" />
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{req.brand || 'STANDART MARKA'}</p>
                          {req.specs && (
                             <>
                               <span className="text-slate-200">•</span>
                               <p className="text-xs font-bold text-slate-500 uppercase">{req.specs}</p>
                             </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right bg-emerald-50/50 px-8 py-4 rounded-[1.5rem] border border-emerald-50">
                      <p className="text-3xl font-black text-emerald-700 tracking-tighter leading-none">{group.supplier.price.toFixed(2)} <span className="text-lg text-emerald-400">TL</span></p>
                      <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mt-2">BİRİM FİYAT ANALİZİ</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {groupedBySupplier.unassigned.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6 ml-4">Fiyat Kaydı Bulunmayan Ürünler</h3>
            <div className="space-y-4">
              {groupedBySupplier.unassigned.map(req => (
                <div key={req.id} className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl">{req.amount}</div>
                      <div>
                        <p className="text-xl font-black text-slate-800 tracking-tight">{req.productName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Tedarikçi atanamadı - Fiyat bilgisi yetersiz</p>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-200"><Search size={32} strokeWidth={2.5}/></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingRequests.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-white p-20 rounded-[4rem] border border-dashed border-slate-200 max-w-2xl mx-auto shadow-sm">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-emerald-500" size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.3em]">Bekleyen Sipariş Bulunmuyor</h3>
              <p className="text-slate-400 mt-4 font-medium italic">Tüm mutfak talepleri sisteme işlenmiş veya tamamlanmış durumda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
