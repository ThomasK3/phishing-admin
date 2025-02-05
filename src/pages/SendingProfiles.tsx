import React, { useState, useEffect } from 'react';
import { Mail, Save, Trash2, TestTube, Shield, AlertCircle, Send } from 'lucide-react';
import { api } from '../services/api';

interface SendingProfile {
 _id?: string;
 id: number;  
 profileName: string;
 interfaceType: 'SMTP';
 smtpFrom: string;
 host: string;
 port: number;
 username: string;
 password: string;
 useTLS: boolean;
 headers: {
   key: string;
   value: string;
 }[];
 replyToAddress: string;
 spoofedDomain: string;
 customBoundary: string;
}

const SendingProfiles: React.FC = () => {
 const [profiles, setProfiles] = useState<SendingProfile[]>([]);
 const [currentProfile, setCurrentProfile] = useState<SendingProfile>({
  id: 0,
  profileName: 'Local SMTP',
  interfaceType: 'SMTP',
  smtpFrom: 'david.krcmarik@pslib.cz', // email který chcete "spoofnout"
  host: '192.168.1.14',  // nebo IP adresa vašeho počítače
  port: 25,          // port který jste nastavili
  username: 'phishing-admin@test.local',  // uživatel z hMailServeru
  password: 'admin',     // heslo z hMailServeru
  useTLS: false,     // vypnuto protože používáme port 25
  headers: [
    { key: 'X-Custom-Header', value: '{{.URL}}-phish' }
  ],
  replyToAddress: '',
  spoofedDomain: '',
  customBoundary: ''
});

 useEffect(() => {
   const loadProfiles = async () => {
     try {
       const loadedProfiles = await api.getSendingProfiles();
       setProfiles(loadedProfiles);
     } catch (error) {
       console.error('Chyba při načítání profilů:', error);
     }
   };

   loadProfiles();
 }, []);

 const testConnection = async (profile: SendingProfile) => {
   const id = profile._id || profile.id.toString();
   try {
     const response = await fetch(`http://localhost:3001/api/sending-profiles/${id}/test-connection`, {
       method: 'POST',
     });
     
     const data = await response.json();
     if (response.ok) {
       alert('Test připojení byl úspěšný');
     } else {
       alert(`Chyba připojení: ${data.details || data.error}`);
     }
   } catch (error) {
     alert('Chyba při testování připojení');
   }
 };

 const sendTestEmail = async (profile: SendingProfile) => {
   const id = profile._id || profile.id.toString();
   const email = prompt('Zadejte emailovou adresu pro testovací zprávu:');
   if (!email) return;

   try {
     const response = await fetch(`http://localhost:3001/api/sending-profiles/${id}/test-email`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ testEmailTo: email }),
     });
     
     const data = await response.json();
     if (response.ok) {
       alert('Testovací email byl odeslán');
     } else {
       alert(`Chyba při odesílání: ${data.details || data.error}`);
     }
   } catch (error) {
     alert('Chyba při odesílání testovacího emailu');
   }
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   
   if (!currentProfile.profileName || !currentProfile.smtpFrom || !currentProfile.host || !currentProfile.username) {
     alert('Prosím vyplňte všechny povinné údaje');
     return;
   }
 
   try {
     let savedProfile: SendingProfile;
     if (currentProfile.id) {
       savedProfile = await api.updateSendingProfile(currentProfile.id.toString(), currentProfile);
       setProfiles(profiles.map(p => p.id === savedProfile.id ? savedProfile : p));
     } else {
       savedProfile = await api.createSendingProfile(currentProfile);
       setProfiles([...profiles, savedProfile]);
     }
 
     setCurrentProfile({
       id: 0,
       profileName: '',
       interfaceType: 'SMTP',
       smtpFrom: '',
       host: '',
       port: 587,
       username: '',
       password: '',
       useTLS: true,
       headers: [
         { key: 'X-Custom-Header', value: '{{.URL}}-phish' }
       ],
       replyToAddress: '',
       spoofedDomain: '',
       customBoundary: ''
     });
 
     alert('Profil byl úspěšně uložen');
   } catch (error) {
     console.error('Chyba při ukládání profilu:', error);
     alert('Nepodařilo se uložit profil');
   }
 };

 const deleteProfile = async (id: number) => {
   if (!window.confirm('Opravdu chcete smazat tento profil?')) {
     return;
   }

   try {
     await api.deleteSendingProfile(id.toString());
     setProfiles(profiles.filter(profile => profile.id !== id));
   } catch (error) {
     console.error('Chyba při mazání profilu:', error);
     alert('Nepodařilo se smazat profil');
   }
 };

 return (
   <div className="max-w-6xl mx-auto p-6">
     <div className="flex items-center mb-6">
       <Mail className="mr-2" />
       <h1 className="text-2xl font-bold">Profily odesílatelů</h1>
     </div>

     <div className="bg-white p-6 rounded-lg shadow mb-6">
       <form onSubmit={handleSubmit}>
         {/* Základní informace */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
             <label className="block text-sm font-medium mb-2">Název profilu</label>
             <input
               type="text"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.profileName}
               onChange={(e) => setCurrentProfile({...currentProfile, profileName: e.target.value})}
               placeholder="např. Firemní Gmail"
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">SMTP From</label>
             <input
               type="text"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.smtpFrom}
               onChange={(e) => setCurrentProfile({...currentProfile, smtpFrom: e.target.value})}
               placeholder="jmeno@domena.cz"
             />
           </div>
         </div>

         {/* SMTP nastavení */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
           <div>
             <label className="block text-sm font-medium mb-2">SMTP Host</label>
             <input
               type="text"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.host}
               onChange={(e) => setCurrentProfile({...currentProfile, host: e.target.value})}
               placeholder="smtp.gmail.com"
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">Port</label>
             <input
               type="number"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.port}
               onChange={(e) => setCurrentProfile({...currentProfile, port: parseInt(e.target.value)})}
               placeholder="587"
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">TLS</label>
             <div className="flex items-center mt-3">
               <input
                 type="checkbox"
                 className="mr-2"
                 checked={currentProfile.useTLS}
                 onChange={(e) => setCurrentProfile({...currentProfile, useTLS: e.target.checked})}
               />
               <span className="text-sm">Použít TLS</span>
             </div>
           </div>
         </div>

         {/* Přihlašovací údaje */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
             <label className="block text-sm font-medium mb-2">Username</label>
             <input
               type="text"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.username}
               onChange={(e) => setCurrentProfile({...currentProfile, username: e.target.value})}
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">Password</label>
             <input
               type="password"
               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
               value={currentProfile.password}
               onChange={(e) => setCurrentProfile({...currentProfile, password: e.target.value})}
             />
           </div>
         </div>

         {/* Headers */}
         <div className="mb-4">
           <label className="block text-sm font-medium mb-2">Email Headers</label>
           {currentProfile.headers.map((header, index) => (
             <div key={index} className="flex gap-2 mb-2">
               <input
                 type="text"
                 className="w-1/3 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                 value={header.key}
                 onChange={(e) => {
                   const newHeaders = [...currentProfile.headers];
                   newHeaders[index].key = e.target.value;
                   setCurrentProfile({...currentProfile, headers: newHeaders});
                 }}
                 placeholder="Header name"
               />
               <input
                 type="text"
                 className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                 value={header.value}
                 onChange={(e) => {
                   const newHeaders = [...currentProfile.headers];
                   newHeaders[index].value = e.target.value;
                   setCurrentProfile({...currentProfile, headers: newHeaders});
                 }}
                 placeholder="Header value"
               />
               <button
                 type="button"
                 onClick={() => {
                   const newHeaders = currentProfile.headers.filter((_, i) => i !== index);
                   setCurrentProfile({...currentProfile, headers: newHeaders});
                 }}
                 className="p-2 text-red-500 hover:text-red-700"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
             </div>
           ))}
           <button
             type="button"
             onClick={() => {
               setCurrentProfile({
                 ...currentProfile,
                 headers: [...currentProfile.headers, { key: '', value: '' }]
               });
             }}
             className="mt-2 text-sm text-blue-500 hover:text-blue-700"
           >
             + Přidat header
           </button>
         </div>

         <div className="flex justify-end space-x-2">
           <button
             type="button"
             onClick={() => testConnection(currentProfile)}
             className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
           >
             <TestTube className="w-4 h-4 mr-2" />
             Test připojení
           </button>
           <button
             type="button"
             onClick={() => sendTestEmail(currentProfile)}
             className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
           >
             <Send className="w-4 h-4 mr-2" />
             Test odeslání
           </button>
           <button
             type="submit"
             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
           >
             <Save className="w-4 h-4 mr-2" />
             Uložit profil
           </button>
         </div>
       </form>
     </div>

     {/* Seznam existujících profilů */}
     <div className="bg-white p-6 rounded-lg shadow">
       <h2 className="text-xl font-semibold mb-4">Existující profily</h2>
       <div className="space-y-4">
         {profiles.map(profile => (
           <div key={profile.id} className="border p-4 rounded">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-medium">{profile.profileName}</h3>
                 <p className="text-sm text-gray-600">{profile.smtpFrom}</p>
                 <p className="text-sm text-gray-600">{profile.host}:{profile.port}</p>
                 <div className="flex space-x-2 mt-1">
                   {profile.useTLS && (
                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                       <Shield className="w-3 h-3 mr-1" />
                       TLS
                     </span>
                   )}
                   {profile.spoofedDomain && (
                     <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                       <AlertCircle className="w-3 h-3 mr-1" />
                       Spoofed
                     </span>
                   )}
                 </div>
               </div>
               <div className="flex space-x-2">
                 <button
                   onClick={() => testConnection(profile)}
                   className="p-2 text-gray-500 hover:text-gray-700"
                   title="Test SMTP připojení"
                 >
                   <TestTube className="w-4 h-4" />
                 </button>
                 <button
                   onClick={() => sendTestEmail(profile)}
                   className="p-2 text-gray-500 hover:text-gray-700"
                   title="Odeslat testovací email"
                 >
                   <Send className="w-4 h-4" />
                 </button>
                 <button
                   onClick={() => deleteProfile(profile.id)}
                   className="p-2 text-red-500 hover:text-red-700"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );
};

export default SendingProfiles;