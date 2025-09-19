import React, { useState, useEffect } from 'react';
// Importamos la conexión a la base de datos y las funciones de Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

// --- URL del "Cartero" de Google Apps Script ---
// IMPORTANTE: Pega aquí la URL que copiaste al implementar tu script de Google
const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/salesianosciudadreal.com/s/AKfycbzKMwC-uQZIyvhfNfgzryc3Ccfubb0F2zGTdkSNHANQWNLLt1m1Sz-xhCrFWkurgvcl/exec'; 

// --- Configuración y Conexión con Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyAMu1V172CvZaBMk9yZ3fTvPvaRA4NPo8g",
  authDomain: "gestor-sustituciones-cr.firebaseapp.com",
  projectId: "gestor-sustituciones-cr",
  storageBucket: "gestor-sustituciones-cr.firebasestorage.app",
  messagingSenderId: "331507261554",
  appId: "1:331507261554:web:076c3665e33f394b94e2eb"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// --- Base de Datos de Usuarios ---
const users = [
    { id: 1, name: 'Alberto López', email: 'alberto.lopez@salesianosciudadreal.com', role: 'profesor' },
    { id: 2, name: 'Ana Moraga', email: 'ana.moraga@salesianosciudadreal.com', role: 'profesor' },
    { id: 3, name: 'Andrea Gómez', email: 'andrea.gomez@salesianosciudadreal.com', role: 'profesor' },
    { id: 4, name: 'Ángel L. Novillo', email: 'angell.novillo@salesianosciudadreal.com', role: 'profesor' },
    { id: 5, name: 'Ángela Cerro', email: 'angela.cerro@salesianosciudadreal.com', role: 'profesor' },
    { id: 6, name: 'Ángeles Sánchez', email: 'angeles.sanchez@salesianosciudadreal.com', role: 'profesor' },
    { id: 7, name: 'Antonio Esgueva', email: 'antonio.esgueva@salesianosciudadreal.com', role: 'profesor' },
    { id: 8, name: 'Antonio Llorens', email: 'antonio.llorens@salesianosciudadreal.com', role: 'profesor' },
    { id: 9, name: 'Antonio Zamora', email: 'antonio.zamora@salesianosciudadreal.com', role: 'profesor' },
    { id: 10, name: 'Beatriz Granados', email: 'beatriz.granados@salesianosciudadreal.com', role: 'profesor' },
    { id: 11, name: 'Carmen Pinto', email: 'carmen.pinto@salesianosciudadreal.com', role: 'profesor' },
    { id: 12, name: 'Carmen Ruiz', email: 'carmen.ruiz@salesianosciudadreal.com', role: 'profesor' },
    { id: 13, name: 'Elena López', email: 'elena.lopez@salesianosciudadreal.com', role: 'profesor' },
    { id: 14, name: 'Eva Cobo', email: 'eva.cobo@salesianosciudadreal.com', role: 'profesor' },
    { id: 15, name: 'Gema Ruiz', email: 'gema.ruiz@salesianosciudadreal.com', role: 'profesor' },
    { id: 16, name: 'Isabel Estudillo', email: 'isabel.estudillo@salesianosciudadreal.com', role: 'profesor' },
    { id: 17, name: 'Javier Sánchez', email: 'javier.sanchez@salesianosciudadreal.com', role: 'coordinador' },
    { id: 18, name: 'José Julián Álvarez', email: 'josejulian.alvarez@salesianosciudadreal.com', role: 'profesor' },
    { id: 19, name: 'José Luis Neira', email: 'joseluis.neira@salesianosciudadreal.com', role: 'profesor' },
    { id: 20, name: 'Jose Mª García', email: 'josema.garcia@salesianosciudadreal.com', role: 'profesor' },
    { id: 21, name: 'Juan Crespo', email: 'juan.crespo@salesianosciudadreal.com', role: 'profesor' },
    { id: 22, name: 'Lara Camarena', email: 'lara.camarena@salesianosciudadreal.com', role: 'profesor' },
    { id: 23, name: 'Laura Barrientos', email: 'laura.barrientos@salesianosciudadreal.com', role: 'profesor' },
    { id: 24, name: 'Laura Bomstein', email: 'laura.bomstein@salesianosciudadreal.com', role: 'profesor' },
    { id: 25, name: 'Lucía García', email: 'lucia.garcia@salesianosciudadreal.com', role: 'profesor' },
    { id: 26, name: 'Luis Fdo Ariza', email: 'luisfdo.ariza@salesianosciudadreal.com', role: 'profesor' },
    { id: 27, name: 'Mª José Sabina', email: 'majose.sabina@salesianosciudadreal.com', role: 'profesor' },
    { id: 28, name: 'Marcos Trujillo', email: 'marcos.trujillo@salesianosciudadreal.com', role: 'profesor' },
    { id: 29, name: 'María San Martín', email: 'maria.sanmartin@salesianosciudadreal.com', role: 'profesor' },
    { id: 30, name: 'Maribel Díaz', email: 'maribel.diaz@salesianosciudadreal.com', role: 'profesor' },
    { id: 31, name: 'Marisa López', email: 'marisa.lopez@salesianosciudadreal.com', role: 'profesor' },
    { id: 32, name: 'Marta Llorens', email: 'marta.llorens@salesianosciudadreal.com', role: 'coordinador' },
    { id: 33, name: 'Miguel Ángel Muñoz', email: 'miguelangel.munoz@salesianosciudadreal.com', role: 'profesor' },
    { id: 34, name: 'Rafael Conde', email: 'rafael.conde@salesianosciudadreal.com', role: 'profesor' },
    { id: 35, name: 'Raquel Conde', email: 'raquel.conde@salesianosciudadreal.com', role: 'profesor' },
    { id: 36, name: 'Rosario García', email: 'rosario.garcia@salesianosciudadreal.com', role: 'profesor' },
    { id: 37, name: 'Susana Caballero', email: 'susana.caballero@salesianosciudadreal.com', role: 'coordinador' },
];

const schedules = {
  21: { 
    1: ["2a", "2a", "3ab", "3ab", "2b", "2b"], 
    2: [null, null, "2b", "2b", "P", "RP"],     
    3: ["2a", "2a", "3ab", null, null, null], 
    4: ["3ab", "3ab", "2a", "2b", "2b", null], 
    5: ["2b", "2a", "P", "3ab", null, null],    
  }
};


// --- Componente Principal ---
export default function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login');
    const [substitutions, setSubstitutions] = useState([]);
    const [gruposEscoba, setGruposEscoba] = useState([]); 
    const [examenesGlobales, setExamenesGlobales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSubstitution, setEditingSubstitution] = useState(null);

    useEffect(() => {
        const savedUserEmail = localStorage.getItem('gestorSustitucionesUser');
        if (savedUserEmail) {
            const foundUser = users.find(u => u.email === savedUserEmail);
            if (foundUser) {
                setUser(foundUser);
                setView(foundUser.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard');
            }
        }

        const unsubSubstitutions = onSnapshot(collection(db, "substitutions"), (snapshot) => {
            setSubstitutions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
        const unsubGruposEscoba = onSnapshot(collection(db, "gruposEscoba"), (snapshot) => {
            setGruposEscoba(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
        const unsubExamenes = onSnapshot(collection(db, "examenesGlobales"), (snapshot) => {
            setExamenesGlobales(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        setLoading(false);

        return () => {
            unsubSubstitutions();
            unsubGruposEscoba();
            unsubExamenes();
        };
    }, []);

    const navigateTo = (targetView, data = null) => {
        if (targetView === 'editSubstitution') {
            setEditingSubstitution(data);
            setView('generateSubstitution');
        } else {
            setEditingSubstitution(null);
            setView(targetView);
        }
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
            setUser(foundUser);
            setView(foundUser.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard');
            setError('');
            if (rememberMe) {
                localStorage.setItem('gestorSustitucionesUser', foundUser.email);
            } else {
                localStorage.removeItem('gestorSustitucionesUser');
            }
        } else {
            setError('Usuario no encontrado. Verifique el correo.');
        }
    };
    
    if (loading && !user) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 max-w-lg">
                {view === 'login' && <LoginScreen {...{setEmail, setPassword, handleLogin, error, rememberMe, setRememberMe}} />}
                {user?.role === 'profesor' && (
                    <>
                        {view === 'teacherDashboard' && <TeacherDashboard {...{user, navigateTo}} />}
                        {view === 'generateSubstitution' && <SubstitutionForm {...{user, editingSubstitution, navigateTo, users}} />}
                        {view === 'history' && <HistoryScreen {...{user, substitutions, navigateTo}} />}
                        {view === 'schedule' && <ScheduleScreen {...{user, substitutions, gruposEscoba, examenesGlobales, navigateTo}} />}
                    </>
                )}
                 {user?.role === 'coordinador' && (
                    <>
                       {view === 'coordinatorDashboard' && <CoordinatorDashboard {...{user, navigateTo}} />}
                       {view === 'eventsDashboard' && <EventsDashboard {...{navigateTo}} />}
                       {view === 'manageSubstitutions' && <ManageSubstitutionsScreen {...{substitutions, navigateTo, users}} />}
                       {view === 'assignSuplente' && <AssignSuplenteScreen {...{substitutions, navigateTo, users, gruposEscoba, examenesGlobales}} />}
                       {view === 'manageEscoba' && <ManageEscobaScreen {...{gruposEscoba, navigateTo, users, substitutions, examenesGlobales}} />}
                       {view === 'manageExamenes' && <ManageExamenesScreen {...{examenesGlobales, navigateTo, users, substitutions, gruposEscoba}} />}
                       {view === 'reports' && <ReportsScreen {...{substitutions, users, navigateTo}} />}
                       {view === 'generateSubstitution' && <SubstitutionForm {...{user, editingSubstitution, navigateTo, users}} />}
                       {view === 'history' && <HistoryScreen {...{user, substitutions, navigateTo}} />}
                       {view === 'schedule' && <ScheduleScreen {...{user, substitutions, gruposEscoba, examenesGlobales, navigateTo}} />}
                    </>
                )}
            </div>
        </div>
    );
}

// --- Componentes ---

function LoginScreen({ setEmail, setPassword, handleLogin, error, rememberMe, setRememberMe }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-down">
            <img src="https://salesianosciudadreal.com/wp-content/uploads/2021/11/logo-color-400x163.png" alt="Logo Salesianos" className="w-48 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Gestor de Sustituciones</h1>
            <p className="text-center text-gray-500 mb-8">Inicia sesión para continuar</p>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input type="email" onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="ml-2">Recuérdame</span>
                </label>
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            <button onClick={handleLogin} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md">
                Iniciar Sesión
            </button>
        </div>
    );
}

function TeacherDashboard({ user, navigateTo }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido,</h1>
            <p className="text-xl text-blue-600 mb-8">{user.name}</p>
            <div className="space-y-4">
                <DashboardButton onClick={() => navigateTo('schedule')} icon={<ClockIcon />} title="Mi Horario" subtitle="Consulta tu horario y guardias de hoy"/>
                <DashboardButton onClick={() => navigateTo('generateSubstitution')} icon={<PencilSquareIcon />} title="Solicitar Permiso" subtitle="Informa de una nueva ausencia"/>
                <DashboardButton onClick={() => navigateTo('history')} icon={<BookOpenIcon />} title="Mis Solicitudes" subtitle="Consulta el estado de tus ausencias"/>
            </div>
        </div>
    );
}

function CoordinatorDashboard({ user, navigateTo }) {
     return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Coordinación</h1>
            <p className="text-xl text-blue-600 mb-8">{user.name}</p>
            <div className="space-y-4">
                <DashboardButton onClick={() => navigateTo('generateSubstitution')} icon={<PencilSquareIcon />} title="Solicitar Permiso" subtitle="Crea una ausencia para un compañero"/>
                <DashboardButton onClick={() => navigateTo('eventsDashboard')} icon={<SparklesIcon />} title="Gestionar Eventos" subtitle="Excursiones, exámenes globales..."/>
                <DashboardButton onClick={() => navigateTo('manageSubstitutions')} icon={<CheckBadgeIcon />} title="Gestionar Solicitudes" subtitle="Acepta o deniega peticiones"/>
                <DashboardButton onClick={() => navigateTo('assignSuplente')} icon={<UserGroupIcon />} title="Comunicar Suplencias" subtitle="Asigna suplentes a las ausencias"/>
                <DashboardButton onClick={() => navigateTo('reports')} icon={<ChartBarIcon />} title="Consultar Informes" subtitle="Analiza el historial de ausencias"/>
                <hr className="my-4"/>
                <DashboardButton onClick={() => navigateTo('history')} icon={<BookOpenIcon />} title="Mis Solicitudes" subtitle="Consulta tus propias ausencias"/>
            </div>
        </div>
    );
}

function EventsDashboard({ navigateTo }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <button onClick={() => navigateTo('coordinatorDashboard')} className="text-blue-600 mb-4">&larr; Volver al Panel Principal</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Eventos</h1>
            <div className="space-y-4">
                <DashboardButton onClick={() => navigateTo('manageEscoba')} icon={<CalendarDaysIcon />} title="Gestionar Grupos Escoba" subtitle="Organiza excursiones y eventos"/>
                <DashboardButton onClick={() => navigateTo('manageExamenes')} icon={<PencilIcon />} title="Planificar Exámenes" subtitle="Asigna supervisores para globales"/>
            </div>
        </div>
    );
}


function DashboardButton({ icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition duration-300">
            <div className="w-10 h-10 mr-4 text-blue-600">{icon}</div>
            <div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="ml-auto text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        </button>
    );
}

function SubstitutionForm({ user, navigateTo, editingSubstitution, users }) {
    const [selectedUserId, setSelectedUserId] = useState(editingSubstitution?.userId ?? user.id);
    const [absenceType, setAbsenceType] = useState(editingSubstitution ? (editingSubstitution.isFullDay ? 'fullDay' : 'hourly') : 'fullDay');
    const [date, setDate] = useState(editingSubstitution?.date ?? '');
    const [startDate, setStartDate] = useState(editingSubstitution?.startDate ?? '');
    const [endDate, setEndDate] = useState(editingSubstitution?.endDate ?? '');
    const [startTime, setStartTime] = useState(editingSubstitution?.startTime ?? '08:00');
    const [endTime, setEndTime] = useState(editingSubstitution?.endTime ?? '09:00');
    const [reason, setReason] = useState(editingSubstitution?.reason ?? 'Personal');
    const [absenceDuration, setAbsenceDuration] = useState(editingSubstitution ? (editingSubstitution.startDate ? 'multipleDays' : 'singleDay') : 'singleDay');
    
    const isEditingAccepted = editingSubstitution && editingSubstitution.status === 'Aceptada';

    const handleSubmit = async () => {
        const targetUser = users.find(u => u.id === parseInt(selectedUserId));
        const substitutionData = {
            userId: targetUser.id,
            userName: targetUser.name,
            status: isEditingAccepted ? 'Pendiente' : (editingSubstitution?.status ?? 'Pendiente'),
            date: absenceDuration === 'singleDay' ? date : null,
            startDate: absenceDuration === 'multipleDays' ? startDate : null,
            endDate: absenceDuration === 'multipleDays' ? endDate : null,
            isFullDay: absenceDuration === 'multipleDays' || (absenceDuration === 'singleDay' && absenceType === 'fullDay'),
            startTime: absenceDuration === 'singleDay' && absenceType === 'hourly' ? startTime : null,
            endTime: absenceDuration === 'singleDay' && absenceType === 'hourly' ? endTime : null,
            reason,
            hourlyAssignments: {}
        };
        
        if (editingSubstitution) {
             await updateDoc(doc(db, "substitutions", editingSubstitution.id), substitutionData);
        } else {
            await addDoc(collection(db, "substitutions"), substitutionData);
        }
        
        navigateTo(user.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo(user.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingSubstitution ? 'Editar Solicitud' : 'Solicitar Permiso'}</h2>
            
            {user.role === 'coordinador' && (
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Crear ausencia para:</label>
                    <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option value={user.id}>Mí mismo ({user.name})</option>
                        {users.filter(u => u.id !== user.id).map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {isEditingAccepted && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg">
                    <p className="font-bold">Atención</p>
                    <p>Esta solicitud ya fue aceptada. Si la modificas, volverá al estado "Pendiente" y necesitará ser aprobada de nuevo.</p>
                </div>
            )}
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Duración</label>
                    <select value={absenceDuration} onChange={e => setAbsenceDuration(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option value="singleDay">Un solo día</option>
                        <option value="multipleDays">Varios días</option>
                    </select>
                </div>
                {absenceDuration === 'singleDay' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Tipo</label>
                             <select value={absenceType} onChange={e => setAbsenceType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                 <option value="fullDay">Día completo</option>
                                 <option value="hourly">Por horas</option>
                             </select>
                        </div>
                         {absenceType === 'hourly' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora inicio</label>
                                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora fin</label>
                                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        )}
                    </>
                )}
                 {absenceDuration === 'multipleDays' && (
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha fin</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Motivo</label>
                    <select value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option>Personal</option>
                        <option>Colegial</option>
                    </select>
                </div>
            </div>
            <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                {editingSubstitution ? 'Guardar Cambios' : 'Enviar Solicitud'}
            </button>
        </div>
    );
}

function HistoryScreen({ user, substitutions, navigateTo }) {
    const [filter, setFilter] = useState('Aceptada'); 

    const isFutureOrToday = (sub) => {
        const dateString = sub.endDate || sub.date;
        if (!dateString) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        return new Date(dateString + 'T00:00:00') >= today;
    };
    
    const filteredAndSortedSubstitutions = substitutions
        .filter(sub => {
            if (sub.userId !== user.id) return false;

            if (filter !== 'Todas' && !isFutureOrToday(sub)) {
                return false;
            }

            if (filter === 'Todas') {
                return true;
            }
            return sub.status === filter;
        })
        .sort((a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate));


    const calculateHours = (sub) => {
        if (sub.isFullDay) return 8; 
        if (sub.startTime && sub.endTime) {
            const start = new Date(`1970-01-01T${sub.startTime}`);
            const end = new Date(`1970-01-01T${sub.endTime}`);
            return (end - start) / (1000 * 60 * 60);
        }
        return 0;
    };
    
    const totalHours = substitutions
        .filter(s => s.userId === user.id)
        .reduce((acc, sub) => acc + calculateHours(sub), 0);

    const handleAnull = async (id) => {
        try {
            await deleteDoc(doc(db, "substitutions", id));
        } catch (error) {
            console.error("Error deleting substitution: ", error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo(user.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Solicitudes</h2>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-center mb-6">
                Horas lectivas ausentadas (total): <span className="font-bold">{totalHours.toFixed(2)}</span>
            </div>
            <div className="flex justify-center space-x-2 mb-6">
                <FilterButton text="Aceptada" active={filter === 'Aceptada'} onClick={() => setFilter('Aceptada')} />
                <FilterButton text="Rechazada" active={filter === 'Rechazada'} onClick={() => setFilter('Rechazada')} />
                <FilterButton text="Pendiente" active={filter === 'Pendiente'} onClick={() => setFilter('Pendiente')} />
                <FilterButton text="Todas" active={filter === 'Todas'} onClick={() => setFilter('Todas')} />
            </div>
            <div className="space-y-4">
                {filteredAndSortedSubstitutions.length > 0 ? filteredAndSortedSubstitutions.map(sub => {
                     const isActionable = sub.status !== 'Rechazada' && isFutureOrToday(sub);
                     return (
                         <div key={sub.id} 
                              className={`p-4 rounded-lg border flex justify-between items-center ${isActionable ? 'hover:bg-gray-50' : 'opacity-70'}`}>
                            <div onClick={() => isActionable && navigateTo('editSubstitution', sub)} className={`flex-grow ${isActionable ? 'cursor-pointer' : ''}`}>
                                <p className="font-semibold">{sub.startDate ? `${sub.startDate} a ${sub.endDate}` : sub.date}</p>
                                <p className="text-sm text-gray-600">{sub.isFullDay ? 'Día completo' : `${sub.startTime} - ${sub.endTime}`} ({sub.reason})</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                               <StatusBadge status={sub.status} />
                               {isActionable && (
                                   <>
                                    <button onClick={(e) => { e.stopPropagation(); navigateTo('editSubstitution', sub); }} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleAnull(sub.id); }} className="p-2 rounded-full text-red-500 hover:bg-red-100 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                   </>
                                )}
                            </div>
                        </div>
                     )
                }) : <p className="text-center text-gray-500 py-4">No hay solicitudes para este filtro.</p>}
            </div>
        </div>
    );
}

function FilterButton({ text, active, onClick }) {
    return <button onClick={onClick} className={`px-4 py-1 text-sm rounded-full transition ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{text}</button>
}

function StatusBadge({ status }) {
    const styles = { 'Aceptada': 'bg-green-100 text-green-800', 'Rechazada': 'bg-red-100 text-red-800', 'Pendiente': 'bg-yellow-100 text-yellow-800' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
}

function ManageSubstitutionsScreen({ substitutions, navigateTo, users }) {
    const [filterDate, setFilterDate] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const pendingSubstitutions = substitutions.filter(s => s.status === 'Pendiente' && (!filterDate || s.date === filterDate || (s.startDate && s.endDate && filterDate >= s.startDate && filterDate <= s.endDate)));

    const handleAction = async (sub, newStatus) => {
        await updateDoc(doc(db, "substitutions", sub.id), { status: newStatus });
        
        const professor = users.find(u => u.id === sub.userId);
        if (!professor) return;

        const emailData = {
            to: professor.email,
            subject: `Tu solicitud de ausencia ha sido ${newStatus}`,
            text: `Hola ${professor.name},\n\nTu solicitud de ausencia para la fecha ${sub.date || sub.startDate} ha sido ${newStatus.toLowerCase()}.\n\nUn saludo,\nCoordinación.`
        };

        setToastMessage('Enviando notificación...');
        setShowToast(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData),
            });
            if (response.ok) {
                setToastMessage('¡Notificación enviada!');
            } else {
                throw new Error('Falló el envío del correo');
            }
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            setToastMessage('Error al notificar.');
        } finally {
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            {showToast && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">{toastMessage}</div>}
            <button onClick={() => navigateTo('coordinatorDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Solicitudes Pendientes</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Filtrar por fecha</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="space-y-4">
                {pendingSubstitutions.length > 0 ? pendingSubstitutions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-lg border bg-gray-50">
                        <p className="font-bold text-gray-800">{sub.userName}</p>
                        <p className="text-sm text-gray-600">{sub.startDate ? `${sub.startDate} a ${sub.endDate}` : sub.date}</p>
                        <p className="text-sm text-gray-600">{sub.isFullDay ? 'Día completo' : `${sub.startTime} - ${sub.endTime}`} ({sub.reason})</p>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button onClick={() => handleAction(sub, 'Aceptada')} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">Aceptar</button>
                            <button onClick={() => handleAction(sub, 'Rechazada')} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Rechazar</button>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-4">No hay solicitudes pendientes para esta fecha.</p>}
            </div>
        </div>
    );
}

function AssignSuplenteScreen({ substitutions, navigateTo, users, gruposEscoba, examenesGlobales }) {
    const [assigningSub, setAssigningSub] = useState(null);
    const [hourlyAssignments, setHourlyAssignments] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const getDatesForSub = (sub) => {
        if (sub.date) return [sub.date];
        if (sub.startDate && sub.endDate) {
            const dates = [];
            let currentDate = new Date(sub.startDate + 'T00:00:00');
            const lastDate = new Date(sub.endDate + 'T00:00:00');
            while (currentDate <= lastDate) {
                if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
                    dates.push(currentDate.toISOString().split('T')[0]);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        }
        return [];
    };

    const getSlotsForDay = (sub, date) => {
        const dayOfWeek = new Date(date + 'T00:00:00').getDay();
        const teacherSchedule = schedules[sub.userId];
        const hourSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"];

        if (teacherSchedule && teacherSchedule[dayOfWeek]) {
            const daySchedule = teacherSchedule[dayOfWeek];
            if (sub.isFullDay || sub.startDate) {
                return daySchedule.map((clase, index) => clase ? { hour: hourSlots[index], class: clase } : null).filter(Boolean);
            } else if (sub.startTime && sub.endTime) {
                const startHour = parseInt(sub.startTime.split(':')[0]);
                const endHour = parseInt(sub.endTime.split(':')[0]);
                return daySchedule.map((clase, index) => {
                    const currentHour = 8 + index;
                    if (clase && currentHour >= startHour && currentHour < endHour) {
                        return { hour: hourSlots[index], class: clase };
                    }
                    return null;
                }).filter(Boolean);
            }
        }

        if (!sub.isFullDay && sub.date === date && sub.startTime && sub.endTime) {
            const slots = [];
            const startHour = parseInt(sub.startTime.split(':')[0]);
            const endHour = parseInt(sub.endTime.split(':')[0]);
            for (let i = startHour; i < endHour; i++) slots.push({ hour: hourSlots[i-8], class: "Clase" });
            return slots;
        }
        
        const slots = [];
        const startHour = 8, endHour = 14;
        for (let i = startHour; i < endHour; i++) slots.push({ hour: hourSlots[i-8], class: "Clase" });
        return slots;
    };

    const isFullyAssigned = (sub) => {
        const dates = getDatesForSub(sub);
        if (dates.length === 0) return true;

        return dates.every(date => {
            const slots = getSlotsForDay(sub, date);
            if (slots.length === 0) return true;
            return slots.every(slot => sub.hourlyAssignments && sub.hourlyAssignments[date] && sub.hourlyAssignments[date][slot.hour]);
        });
    };
    
    const needsAssignmentSubs = substitutions.filter(s => s.status === 'Aceptada' && !isFullyAssigned(s));

    const handleSelectSub = (sub) => {
        setAssigningSub(sub);
        setHourlyAssignments(sub.hourlyAssignments || {});
    };

    const handleAssignmentChange = (date, hour, teacherId) => {
        setHourlyAssignments(prev => ({
            ...prev,
            [date]: { ...(prev[date] || {}), [hour]: teacherId }
        }));
    };

    const handleConfirmAssignments = async () => {
        if (!assigningSub) return;
        await updateDoc(doc(db, "substitutions", assigningSub.id), { hourlyAssignments });
        setToastMessage('Enviando notificaciones...');
        setShowToast(true);

        const assignmentsByTeacher = {};
        for(const date in hourlyAssignments) {
            for(const hour in hourlyAssignments[date]) {
                const teacherId = hourlyAssignments[date][hour];
                if(teacherId) {
                    if(!assignmentsByTeacher[teacherId]) assignmentsByTeacher[teacherId] = [];
                    assignmentsByTeacher[teacherId].push(`- ${date} a las ${hour}`);
                }
            }
        }

        const emailPromises = Object.entries(assignmentsByTeacher).map(async ([teacherId, tasks]) => {
            const teacher = users.find(u => u.id === parseInt(teacherId));
            if(!teacher) return;

            const emailData = {
                to: teacher.email,
                subject: `Asignación de Suplencia`,
                text: `Hola ${teacher.name},\n\nHas sido asignado para cubrir las siguientes horas:\n${tasks.join('\n')}\n\nGracias,\nCoordinación.`
            };
            
            try {
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData),
                });
            } catch (error) {
                console.error(`Error enviando correo a ${teacher.email}:`, error);
            }
        });

        await Promise.all(emailPromises);

        setToastMessage('¡Suplencias comunicadas!');
        setTimeout(() => { setShowToast(false); setAssigningSub(null); }, 2000);
    };

    const getAvailableTeachers = (date, hour) => {
        const busyInSubstitution = new Set(substitutions.flatMap(sub => 
            (sub.hourlyAssignments?.[date]?.[hour]) ? [parseInt(sub.hourlyAssignments[date][hour])] : []
        ));
        const busyInEscoba = new Set(gruposEscoba.flatMap(escoba => 
            (escoba.date === date && escoba.hourlyAssignments?.[hour]) ? [parseInt(escoba.hourlyAssignments[hour])] : []
        ));
        const onExcursion = new Set(gruposEscoba.flatMap(escoba => 
            (escoba.date === date) ? escoba.teachersOnExcursion : []
        ));
        const busyInExamen = new Set(examenesGlobales.flatMap(examen => {
            if (examen.date !== date) return [];
            const assignments = examen.hourlyAssignments?.[hour] || {};
            return Object.values(assignments).map(id => parseInt(id));
        }));

        const unavailableIds = new Set([...busyInSubstitution, ...busyInEscoba, ...onExcursion, ...busyInExamen]);
        return users.filter(u => u.role === 'profesor' && !unavailableIds.has(u.id));
    };
    
    if (assigningSub) {
        const dates = getDatesForSub(assigningSub);
        return (
             <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
                {showToast && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">{toastMessage}</div>}
                <button onClick={() => setAssigningSub(null)} className="text-blue-600 mb-4">&larr; Volver a la lista</button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Asignar Horas</h2>
                <div className="p-4 rounded-lg border bg-gray-50 mb-4">
                    <p className="font-bold text-gray-800">{assigningSub.userName}</p>
                    <p className="text-sm text-gray-600">{assigningSub.date || `${assigningSub.startDate} a ${assigningSub.endDate}`}</p>
                </div>
                <div className="mt-4 space-y-6 max-h-96 overflow-y-auto pr-2">
                    {dates.map(date => (
                        <div key={date}>
                           <h3 className="font-bold text-gray-700 border-b pb-1 mb-2">{new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                            <div className="space-y-4">
                                {getSlotsForDay(assigningSub, date).map(slot => (
                                    <div key={slot.hour} className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {slot.hour} <span className="text-xs text-gray-500">({slot.class})</span>
                                        </label>
                                        <select 
                                            value={(hourlyAssignments[date] && hourlyAssignments[date][slot.hour]) || ''} 
                                            onChange={(e) => handleAssignmentChange(date, slot.hour, e.target.value)} 
                                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
                                        >
                                            <option value="">-- Asignar a... --</option>
                                            {getAvailableTeachers(date, slot.hour).filter(u => u.id !== assigningSub.userId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleConfirmAssignments} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Confirmar Asignaciones</button>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo('coordinatorDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comunicar Suplencias</h2>
             <p className="text-sm text-gray-600 mb-4">Aquí aparecen las ausencias aceptadas que necesitan que se les asigne un suplente.</p>
            <div className="space-y-4">
                 {needsAssignmentSubs.length > 0 ? needsAssignmentSubs.map(sub => (
                    <div key={sub.id} onClick={() => handleSelectSub(sub)} className="p-4 rounded-lg border bg-gray-50 cursor-pointer hover:bg-blue-50">
                        <p className="font-bold text-gray-800">{sub.userName}</p>
                        <p className="text-sm text-gray-600">{sub.date || `${sub.startDate} a ${sub.endDate}`}<span className="text-xs text-gray-500 ml-2">({sub.isFullDay ? 'Día completo' : 'Por horas'})</span></p>
                    </div>
                )) : <p className="text-center text-gray-500 py-4">No hay suplencias por comunicar.</p>}
            </div>
        </div>
    );
}

function ReportsScreen({ substitutions, users, navigateTo }) {
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const teacherList = users.filter(u => u.role === 'profesor' || u.role === 'coordinador');
    
    const calculateHours = (sub) => {
        if (!sub.isFullDay && sub.startTime && sub.endTime) {
            const start = new Date(`1970-01-01T${sub.startTime}:00`);
            const end = new Date(`1970-01-01T${sub.endTime}:00`);
            return Math.abs(end - start) / 36e5;
        }
        if (sub.isFullDay) return 8; 
        return 0;
    };
    
    const getReportData = () => {
        if (!selectedTeacherId) return null;
        const teacherSubs = substitutions.filter(s => s.userId === parseInt(selectedTeacherId) && s.status === 'Aceptada');
        const totalHours = teacherSubs.reduce((sum, sub) => sum + calculateHours(sub), 0);
        const lastMonth = new Date(); lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthSubs = teacherSubs.filter(sub => new Date(sub.date || sub.startDate) > lastMonth);
        return { totalHours, lastMonthSubs };
    };
    
    const reportData = getReportData();

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo('coordinatorDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Centro de Informes</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Seleccionar profesor</label>
                <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                    <option value="">-- Elige un profesor --</option>
                    {teacherList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
            {reportData && (
                <div>
                     <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-6">
                        Total acumulado: <span className="font-bold text-xl">{reportData.totalHours.toFixed(2)}h</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Desglose del Último Mes</h3>
                    <div className="space-y-3 border p-4 rounded-md">
                        {reportData.lastMonthSubs.length > 0 ? reportData.lastMonthSubs.map(sub => (
                             <div key={sub.id} className="text-sm">
                                 <p><span className="font-semibold">{sub.date || sub.startDate}:</span> {sub.isFullDay ? 'Día completo' : `${sub.startTime} - ${sub.endTime}`} ({calculateHours(sub)}h)</p>
                             </div>
                        )) : <p className="text-center text-gray-500 py-2">Sin ausencias aceptadas en el último mes.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

function ManageEscobaScreen({ gruposEscoba, navigateTo, users, substitutions, examenesGlobales }) {
    const [viewMode, setViewMode] = useState('list');
    const [editingEvent, setEditingEvent] = useState(null);

    const handleNewEvent = () => { setEditingEvent(null); setViewMode('form'); };
    const handleSelectEvent = (event) => { setEditingEvent(event); setViewMode('assign'); };
    
    const handleEdit = (e, event) => {
        e.stopPropagation();
        setEditingEvent(event);
        setViewMode('form');
    };

    const handleDelete = async (e, eventId) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "gruposEscoba", eventId));
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    if (viewMode === 'form') return <EscobaForm setViewMode={setViewMode} editingEvent={editingEvent} users={users} />
    if (viewMode === 'assign') return <AssignEscobaScreen event={editingEvent} setViewMode={setViewMode} users={users} substitutions={substitutions} examenesGlobales={examenesGlobales} />

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo('eventsDashboard')} className="text-blue-600 mb-4">&larr; Volver a Eventos</button>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-800">Grupos Escoba</h2>
                 <button onClick={handleNewEvent} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Programar Nuevo</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Gestiona los eventos especiales como excursiones que requieren un grupo de alumnos en el centro.</p>
            <div className="space-y-4">
                {gruposEscoba.length > 0 ? gruposEscoba.map(event => (
                    <div key={event.id} onClick={() => handleSelectEvent(event)} className="p-4 rounded-lg border bg-gray-50 cursor-pointer hover:bg-blue-50 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{event.eventName}</p>
                            <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={(e) => handleEdit(e, event)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                            </button>
                            <button onClick={(e) => handleDelete(e, event.id)} className="p-2 rounded-full text-red-500 hover:bg-red-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-4">No hay eventos programados.</p>}
            </div>
        </div>
    );
}

function EscobaForm({ setViewMode, editingEvent, users }) {
    const [eventName, setEventName] = useState(editingEvent?.eventName || '');
    const [date, setDate] = useState(editingEvent?.date || '');
    const [teachersOnExcursion, setTeachersOnExcursion] = useState(editingEvent?.teachersOnExcursion || []);

    const handleTeacherToggle = (teacherId) => {
        setTeachersOnExcursion(prev => prev.includes(teacherId) ? prev.filter(id => id !== teacherId) : [...prev, teacherId]);
    };

    const handleSubmit = async () => {
        const eventData = { eventName, date, teachersOnExcursion, hourlyAssignments: editingEvent?.hourlyAssignments || {} };
        if (editingEvent) {
            await updateDoc(doc(db, "gruposEscoba", editingEvent.id), eventData);
        } else {
            await addDoc(collection(db, "gruposEscoba"), eventData);
        }
        setViewMode('list');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
             <button onClick={() => setViewMode('list')} className="text-blue-600 mb-4">&larr; Volver a la lista</button>
             <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingEvent ? 'Editar Evento' : 'Programar Grupo Escoba'}</h2>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
                    <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Ej: Excursión 1º ESO" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profesores que van a la excursión (no disponibles)</label>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                        {users.map(user => (
                            <label key={user.id} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100">
                                <input type="checkbox" checked={teachersOnExcursion.includes(user.id)} onChange={() => handleTeacherToggle(user.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span>{user.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
             </div>
             <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
        </div>
    );
}

function AssignEscobaScreen({ event, setViewMode, users, substitutions, examenesGlobales }) {
    const [hourlyAssignments, setHourlyAssignments] = useState(event.hourlyAssignments || {});
    const [showToast, setShowToast] = useState(false);

    const slots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"];

    const getAvailableTeachers = (date, hour) => {
        const busyInSubstitution = new Set(substitutions.flatMap(sub => (sub.hourlyAssignments?.[date]?.[hour]) ? [parseInt(sub.hourlyAssignments[date][hour])] : []));
        const onExcursion = new Set(event.teachersOnExcursion || []);
        const busyInExamen = new Set(examenesGlobales.flatMap(examen => {
            if (examen.date !== date) return [];
            const assignments = examen.hourlyAssignments?.[hour] || {};
            return Object.values(assignments).map(id => parseInt(id));
        }));
        
        const unavailableIds = new Set([...busyInSubstitution, ...onExcursion, ...busyInExamen]);
        return users.filter(u => u.role === 'profesor' && !unavailableIds.has(u.id));
    };

    const handleAssignmentChange = (hour, teacherId) => setHourlyAssignments(prev => ({ ...prev, [hour]: teacherId }));

    const handleConfirmAssignments = async () => {
        await updateDoc(doc(db, "gruposEscoba", event.id), { hourlyAssignments });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            {showToast && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">Asignaciones guardadas</div>}
            <button onClick={() => setViewMode('list')} className="text-blue-600 mb-4">&larr; Volver a Eventos</button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Asignar Horas a Grupo Escoba</h2>
            <div className="p-4 rounded-lg border bg-gray-50 mb-4">
                <p className="font-bold text-gray-800">{event.eventName}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
            </div>
            <div className="mt-4 space-y-4">
                {slots.map(hour => (
                    <div key={hour} className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">{hour}</label>
                        <select value={hourlyAssignments[hour] || ''} onChange={(e) => handleAssignmentChange(hour, e.target.value)} className="w-1/2 p-2 border border-gray-300 rounded-md text-sm">
                            <option value="">-- Asignar a... --</option>
                            {getAvailableTeachers(event.date, hour).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            <button onClick={handleConfirmAssignments} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Confirmar Asignaciones</button>
        </div>
    );
}

function ManageExamenesScreen({ examenesGlobales, navigateTo, users, substitutions, gruposEscoba }) {
    const [viewMode, setViewMode] = useState('list');
    const [editingEvent, setEditingEvent] = useState(null);

    const handleNewEvent = () => { setEditingEvent(null); setViewMode('form'); };
    const handleSelectEvent = (event) => { setEditingEvent(event); setViewMode('assign'); };

    const handleEdit = (e, event) => {
        e.stopPropagation();
        setEditingEvent(event);
        setViewMode('form');
    };

    const handleDelete = async (e, eventId) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "examenesGlobales", eventId));
        } catch (error) {
            console.error("Error deleting exam event: ", error);
        }
    };

    if (viewMode === 'form') return <ExamenForm setViewMode={setViewMode} editingEvent={editingEvent} />
    if (viewMode === 'assign') return <AssignExamenesScreen event={editingEvent} setViewMode={setViewMode} users={users} substitutions={substitutions} gruposEscoba={gruposEscoba} />

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo('eventsDashboard')} className="text-blue-600 mb-4">&larr; Volver a Eventos</button>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-800">Exámenes Globales</h2>
                 <button onClick={handleNewEvent} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Planificar Nuevo</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Organiza la supervisión de los exámenes globales por hora y grupo.</p>
            <div className="space-y-4">
                {examenesGlobales.length > 0 ? examenesGlobales.map(event => (
                    <div key={event.id} onClick={() => handleSelectEvent(event)} className="p-4 rounded-lg border bg-gray-50 cursor-pointer hover:bg-blue-50 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{event.eventName}</p>
                            <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={(e) => handleEdit(e, event)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                            </button>
                            <button onClick={(e) => handleDelete(e, event.id)} className="p-2 rounded-full text-red-500 hover:bg-red-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-4">No hay exámenes planificados.</p>}
            </div>
        </div>
    );
}

function ExamenForm({ setViewMode, editingEvent }) {
    const [eventName, setEventName] = useState(editingEvent?.eventName || '');
    const [date, setDate] = useState(editingEvent?.date || '');

    const handleSubmit = async () => {
        const eventData = { eventName, date, hourlyAssignments: editingEvent?.hourlyAssignments || {} };
        if (editingEvent) {
            await updateDoc(doc(db, "examenesGlobales", editingEvent.id), eventData);
        } else {
            await addDoc(collection(db, "examenesGlobales"), eventData);
        }
        setViewMode('list');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
             <button onClick={() => setViewMode('list')} className="text-blue-600 mb-4">&larr; Volver a la lista</button>
             <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingEvent ? 'Editar Evento de Examen' : 'Planificar Examen Global'}</h2>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
                    <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Ej: Globales 2º Bachillerato" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
             </div>
             <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
        </div>
    );
}

function AssignExamenesScreen({ event, setViewMode, users, substitutions, gruposEscoba }) {
    const [hourlyAssignments, setHourlyAssignments] = useState(event.hourlyAssignments || {});
    const [showToast, setShowToast] = useState(false);

    const slots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"];
    const groups = ["Grupo A", "Grupo B", "Grupo C"];

    const getAvailableTeachers = (date, hour) => {
        const busyInSubstitution = new Set(substitutions.flatMap(sub => (sub.hourlyAssignments?.[date]?.[hour]) ? [parseInt(sub.hourlyAssignments[date][hour])] : []));
        const busyInEscobaAssignment = new Set(gruposEscoba.flatMap(escoba => (escoba.date === date && escoba.hourlyAssignments?.[hour]) ? [parseInt(escoba.hourlyAssignments[hour])] : []));
        const onExcursion = new Set(gruposEscoba.flatMap(escoba => (escoba.date === date) ? escoba.teachersOnExcursion : []));
        
        const unavailableIds = new Set([...busyInSubstitution, ...busyInEscobaAssignment, ...onExcursion]);
        return users.filter(u => !unavailableIds.has(u.id));
    };

    const handleAssignmentChange = (hour, group, teacherId) => {
        setHourlyAssignments(prev => ({
            ...prev,
            [hour]: { ...(prev[hour] || {}), [group]: teacherId }
        }));
    };

    const handleConfirmAssignments = async () => {
        await updateDoc(doc(db, "examenesGlobales", event.id), { hourlyAssignments });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            {showToast && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">Planificación guardada</div>}
            <button onClick={() => setViewMode('list')} className="text-blue-600 mb-4">&larr; Volver a Eventos</button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Planificar Supervisión de Examen</h2>
            <div className="p-4 rounded-lg border bg-gray-50 mb-4">
                <p className="font-bold text-gray-800">{event.eventName}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
            </div>
            <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {slots.map(hour => (
                    <div key={hour}>
                        <h3 className="font-bold text-gray-700 border-b pb-1 mb-2">{hour}</h3>
                        <div className="space-y-3">
                            {groups.map(group => (
                                <div key={group} className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">{group}</label>
                                    <select 
                                        value={(hourlyAssignments[hour] && hourlyAssignments[hour][group]) || ''} 
                                        onChange={(e) => handleAssignmentChange(hour, group, e.target.value)} 
                                        className="w-2/3 p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="">-- Supervisor... --</option>
                                        {getAvailableTeachers(event.date, hour).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleConfirmAssignments} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Guardar Planificación</button>
        </div>
    );
}

function ScheduleScreen({ user, substitutions, gruposEscoba, examenesGlobales, navigateTo }) {
    const userSchedule = schedules[user.id];
    const hourSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"];
    const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayDayOfWeek = today.getDay(); // 1 = Lunes, 5 = Viernes

    const todaysAssignments = [];
    
    substitutions.forEach(sub => {
        const dates = (sub.date) ? [sub.date] : (sub.startDate && sub.endDate ? getDatesForSub(sub) : []);
        if (dates.includes(todayString) && sub.hourlyAssignments && sub.hourlyAssignments[todayString]) {
            Object.entries(sub.hourlyAssignments[todayString]).forEach(([hour, teacherId]) => {
                if (parseInt(teacherId) === user.id) {
                    todaysAssignments.push({ hour, task: `Suplencia (Ausencia de ${sub.userName})` });
                }
            });
        }
    });

    gruposEscoba.forEach(escoba => {
        if (escoba.date === todayString && escoba.hourlyAssignments) {
            Object.entries(escoba.hourlyAssignments).forEach(([hour, teacherId]) => {
                if (parseInt(teacherId) === user.id) {
                    todaysAssignments.push({ hour, task: `Grupo Escoba (${escoba.eventName})` });
                }
            });
        }
    });
    
    examenesGlobales.forEach(examen => {
        if (examen.date === todayString && examen.hourlyAssignments) {
             Object.entries(examen.hourlyAssignments).forEach(([hour, groups]) => {
                Object.entries(groups).forEach(([group, teacherId]) => {
                    if (parseInt(teacherId) === user.id) {
                        todaysAssignments.push({ hour, task: `Supervisión Examen (${examen.eventName} - ${group})` });
                    }
                });
            });
        }
    });
    
    function getDatesForSub(sub) {
        const dates = [];
        let currentDate = new Date(sub.startDate + 'T00:00:00');
        const lastDate = new Date(sub.endDate + 'T00:00:00');
        while(currentDate <= lastDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in-up">
            <button onClick={() => navigateTo(user.role === 'coordinador' ? 'coordinatorDashboard' : 'teacherDashboard')} className="text-blue-600 mb-4">&larr; Volver</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Horario Semanal</h2>

            {!userSchedule && <p className="text-center text-gray-500 py-4">Tu horario aún no ha sido cargado en el sistema.</p>}

            {userSchedule && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-2">Hora</th>
                                {weekDays.map(day => <th key={day} scope="col" className="py-3 px-2 text-center">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {hourSlots.map((hour, hourIndex) => (
                                <tr key={hour} className="bg-white border-b">
                                    <td className="py-2 px-2 font-medium text-gray-900 whitespace-nowrap">{hour}</td>
                                    {weekDays.map((day, dayIndex) => {
                                        const daySchedule = userSchedule[dayIndex + 1];
                                        const clase = daySchedule ? daySchedule[hourIndex] : null;
                                        return (
                                            <td key={`${day}-${hour}`} className={`py-2 px-2 text-center ${dayIndex + 1 === todayDayOfWeek ? 'bg-blue-50' : ''}`}>
                                                {clase || '-'}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Tareas Asignadas para Hoy</h3>
            <div className="space-y-3">
                 {todaysAssignments.length > 0 ? (
                    todaysAssignments.sort((a, b) => a.hour.localeCompare(b.hour)).map((assignment, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="font-semibold text-green-800">{assignment.hour}</p>
                            <p className="text-sm text-green-700">{assignment.task}</p>
                        </div>
                    ))
                ) : <p className="text-center text-gray-500 py-4">No tienes guardias o tareas asignadas para hoy.</p>}
            </div>

        </div>
    );
}


// --- ICONOS SVG ---

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.968 0 3.75 3.75 0 01-5.968 0zM12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.75 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L22.5 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const PencilSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const CalendarDaysIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

