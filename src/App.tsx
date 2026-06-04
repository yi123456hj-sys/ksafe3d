import { useState, useEffect, useRef, createContext } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, Menu, X,
  Shield, AlertTriangle, BarChart3, Brain, Zap, CheckCircle,
  ArrowRight, Play, Database, FileText, Map,
  Target, TrendingUp, DollarSign, Building,
  Layers, Cpu,
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const LanguageContext = createContext<{ language: string; setLanguage: (l: string) => void; t: (k: string) => string; }>({ language: 'ko', setLanguage: () => {}, t: () => '' });

const translations: Record<string, any> = {
  ko: {
    nav: { home: '홈', background: '배경', innovation: '혁신점', features: '기능', digitalTwin: '디지털트윈', comparison: '경쟁력', data: '데이터', cases: '사례', alert: '경고시스템' },
    hero: { title: '한국 최초 AI 산업안전 통합 플랫폼', subtitle: 'K-SAFE3D', description: 'AI 기본법 완벽 매칭 · 7테크 융합 아키텍처 · 12자율 AI 에이전트 · 3D 전국 위험지도', student: '李志秀이지수 | 중국 | 경운대학교 물리치료학과', cta: '데모 체험하기', demo: '기술 영상 보기' },
    digitalTwin: { title: '디지털트윈 스마트 산업단지', subtitle: '물리공간 디지털 복제 + 전과정 데이터 실시간 트윈', description: '전통적인 산업단지 관리의 정보 고립을 깨고 시각화 인터페이스를 통해 전역 상태 인식, 정밀 제어 및 데이터 기반 의사결정을 실현합니다.', converterStatus: '전로 상태', consumptionChart: '단위소비 추이', gasRecovery: '가스 회수량', productionConsumption: '생산량 vs 원료소비', running: '가동중', standby: '대기중', maintenance: '점검중' },
    background: { title: '프로젝트 배경', subtitle: '한국 AI 안전 위기의 현실', stat1: 'AI 안전사고', stat1Value: '1,247건', stat2: '개인정보 유출', stat2Value: '872만명', stat3: '산업경제 손실', stat3Value: '3.2조원', stat4: '중소기업 합규율', stat4Value: '12.7%', problem: '시장 문제점', problemDesc: '해외 AI 안전제품은 한국어 공격방어, AI 기본법 적응, 9도 지역별 시나리오를 지원하지 않습니다.', solution: '우리의 해결책', solutionDesc: '대구·경북 산업단지 맞춤형 R&D 성과로 한국 본지화 AI 산업안전 공백을 메웁니다.' },
    innovation: { title: '4대 독자적 혁신점', subtitle: '심사위원 최고점 확보 핵심', point1: { title: 'KWAI 한국 AI 안전규격', desc: '세계 유일 AI 기본법 적응 S/A/B/C/D 등급체계, 한국 특유 4대 공격시나리오 커버' }, point2: { title: '7-Tech 융합 아키텍처', desc: '컴퓨터비전+밀리미터파+웨어러블+열화상+블록체인+자동신고+3D디지털트윈' }, point3: { title: '12자율 AI 에이전트', desc: '감지→판단→실행→연결 전과정 자율화, 개인정보보호위원회 자동보고' }, point4: { title: '3D 9도 위험지도+AI 어시스턴트', desc: '지역별 사고대장 열람, AI 질의응답, 이미지 위험판별, 자동 개선안 생성' } },
    features: { title: '8대 핵심 기능', subtitle: '산업안전 전주기 통합 관리', f1: { title: '실시간 안전품질관제센터', desc: 'AI 위험행동 초단위 포착, S/A급 고위험 팝업경고' }, f2: { title: '현장순회점검 시뮬레이션', desc: '계획→배정→현장→개선→검증 전과정 디지털화' }, f3: { title: '다차원 빅데이터 분석', desc: '지역·산업·위험등급 교차분석, 월간 위험예측' }, f4: { title: '3D 메타버스 공방훈련소', desc: '한국형 4대 AI 공격 시뮬레이션, 공방성공률 측정' }, f5: { title: '전국 9도 사고DB 원장', desc: 'NAVER/KAKAO/삼성 실제사고 데이터베이스' }, f6: { title: 'AI 기본법 이중컴플라이언스', desc: '자동합규검사, 기한내 개선요청, 법무부 연동 경고' }, f7: { title: '7-Tech 기술아키텍처', desc: '기술스택 상세분해 + 글로벌 4대 경쟁사 비교표' }, f8: { title: '안전게임화+ROI 계산기', desc: '기업 안전포인트 인센티브 시스템 + 투자수익률 원클릭 계산' } },
    comparison: { title: '글로벌 경쟁사 비교', subtitle: 'K-SAFE3D의 압도적 우위', ksafe: 'K-SAFE3D', openai: 'OpenAI Security', google: '구글 AI안전', naver: '네이버 클로바' },
    data: { title: '상용화 데이터 분석', subtitle: '과학적 근거 기반 사업 타당성', roi: 'ROI 투자수익 분석', roiDesc: '50인 기업 연평균 사고 3건, 건당 평균손실 7.5억원 → 플랫폼 연회비 1200만원, 투자회수기간 <4개월', market1: '대구·경북 산업단지', market2: '한국 중소 AI 기업', market3: '지방정부 안전감독부서' },
    cases: { title: '실제 적용 사례', subtitle: '검증된 안전성과 효율성' },
    alert: { title: '실시간 경고 시스템', subtitle: '위험을 미리 감지하고 차단합니다', level1: '일반 경고', level2: '주의 경고', level3: '심각 경고', level4: '긴급 경고' },
    auth: { login: '로그인', register: '회원가입', email: '이메일 주소', password: '비밀번호', submit: '확인', noAccount: '계정이 없으신가요?', hasAccount: '이미 계정이 있으신가요?' },
    footer: { copyright: '© 2026 K-SAFE3D. 경운대학교 AI 산업안전 연구실. 모든 권리 보유.', privacy: '개인정보 처리방침', terms: '이용약관' }
  },
  zh: {
    nav: { home: '首页', background: '立项背景', innovation: '创新亮点', features: '核心功能', digitalTwin: '数字孪生', comparison: '竞品对比', data: '数据分析', cases: '实际案例', alert: '预警系统' },
    hero: { title: '韩国首个AI工业安全综合平台', subtitle: 'K-SAFE3D', description: '完全适配韩国AI基本法 · 7技术融合架构 · 12个自主AI代理 · 3D全国风险地图', student: '李志秀이지수 | 中国 | 庆云大学物理治疗系', cta: '体验演示', demo: '观看技术视频' },
    digitalTwin: { title: '数字孪生智慧工业园区', subtitle: '物理园区数字化复刻 + 全链路数据实时孪生', description: '打破传统园区管理中资源、生产、运维等环节的信息孤岛，以可视化界面实现园区运行状态的全局感知、关键流程的精细管控与管理决策的数据支撑。', converterStatus: '转炉状态', consumptionChart: '单耗趋势图', gasRecovery: '煤气回收曲线', productionConsumption: '钢坯产量与钢铁料消耗', running: '运行中', standby: '待机中', maintenance: '维护中' },
    background: { title: '项目背景', subtitle: '韩国AI安全危机的现实', stat1: 'AI安全事故', stat1Value: '1,247起', stat2: '个人信息泄露', stat2Value: '872万人次', stat3: '产业经济损失', stat3Value: '3.2兆韩元', stat4: '中小企业合规率', stat4Value: '12.7%', problem: '市场痛点', problemDesc: '海外AI安全产品不支持韩语攻防、韩国AI基本法适配和9道区域场景。', solution: '我们的解决方案', solutionDesc: '针对大邱·庆北工业区定制化研发，填补韩国本地化AI工业安全空白。' },
    innovation: { title: '4大原创创新点', subtitle: '评审打分核心优势', point1: { title: 'KWAI韩国本土AI安全规范', desc: '全球唯一适配韩国AI基本法的S/A/B/C/D分级体系，覆盖韩国4类特有攻击场景' }, point2: { title: '7-Tech七维融合架构', desc: '计算机视觉+毫米波雷达+可穿戴+热成像+区块链+自动上报+3D数字孪生' }, point3: { title: '12个自主AI代理', desc: '感知→判断→执行→联动全流程自主化，自动对接韩国个人信息保护委员会上报' }, point4: { title: '3D九道风险地图+AI助手', desc: '点击查看区域事故台账，AI问答、图片隐患识别、自动生成整改方案' } },
    features: { title: '8大核心功能', subtitle: '工业安全全周期一体化管理', f1: { title: '实时安全质量控制中心', desc: 'AI秒级捕获风险行为，S/A级高危弹窗预警' }, f2: { title: '现场巡检模拟系统', desc: '计划→派单→现场→整改→复验全流程数字化' }, f3: { title: '多维度大数据决策分析', desc: '跨区域/行业/风险等级交叉分析，月度风险预测' }, f4: { title: '3D元宇宙攻防演练实验室', desc: '韩系4类AI攻击仿真演练，攻防成功率测算' }, f5: { title: '全国九道事故数据库', desc: 'NAVER/KAKAO/三星真实事故案例入库' }, f6: { title: 'AI基本法双重合规系统', desc: '自动合规校验，限期整改通知，联动法务预警' }, f7: { title: '7-Tech技术架构对比', desc: '技术栈拆解+全球四大竞品横向对比表' }, f8: { title: '安全游戏化+ROI计算器', desc: '企业安全积分激励体系+一键测算投资回报率' } },
    comparison: { title: '全球竞品对比', subtitle: 'K-SAFE3D的绝对优势', ksafe: 'K-SAFE3D', openai: 'OpenAI安全', google: '谷歌AI安全', naver: 'NAVER CLOVA' },
    data: { title: '商业化数据分析', subtitle: '科学依据支撑的商业可行性', roi: 'ROI投资收益分析', roiDesc: '50人企业年均事故3起，单次平均损失7.5亿韩元 → 平台年费1200万韩元，投资回收期<4个月', market1: '大邱·庆北工业园区', market2: '韩国本土中小AI企业', market3: '韩国地方政府安监部门' },
    cases: { title: '实际应用案例', subtitle: '经过验证的安全性与效率' },
    alert: { title: '实时预警系统', subtitle: '提前检测并阻断风险', level1: '一般预警', level2: '注意预警', level3: '严重预警', level4: '紧急预警' },
    auth: { login: '登录', register: '注册', email: '电子邮箱', password: '密码', submit: '确认', noAccount: '还没有账户？', hasAccount: '已有账户？' },
    footer: { copyright: '© 2026 K-SAFE3D. 庆云大学AI工业安全实验室. 保留所有权利。', privacy: '隐私政策', terms: '使用条款' }
  },
  en: {
    nav: { home: 'Home', background: 'Background', innovation: 'Innovation', features: 'Features', digitalTwin: 'Digital Twin', comparison: 'Comparison', data: 'Data', cases: 'Cases', alert: 'Alert' },
    hero: { title: "Korea's First AI Industrial Safety Platform", subtitle: 'K-SAFE3D', description: 'Full AI Basic Law Compliance · 7-Tech Fusion · 12 Autonomous AI Agents · 3D National Risk Map', student: 'Li Zhixiu이지수 | China | Kyungwoon Univ. Physical Therapy', cta: 'Try Demo', demo: 'Watch Video' },
    digitalTwin: { title: 'Digital Twin Smart Industrial Park', subtitle: 'Physical Park Digital Replica + Full-Process Real-Time Data Twin', description: 'Break information silos in traditional park management, achieve global awareness and data-driven decisions.', converterStatus: 'Converter Status', consumptionChart: 'Unit Consumption Trend', gasRecovery: 'Gas Recovery Curve', productionConsumption: 'Production vs Material Consumption', running: 'Running', standby: 'Standby', maintenance: 'Maintenance' },
    background: { title: 'Project Background', subtitle: "Korea's AI Safety Crisis", stat1: 'AI Incidents', stat1Value: '1,247', stat2: 'Data Breaches', stat2Value: '8.72M', stat3: 'Economic Loss', stat3Value: '₩3.2T', stat4: 'SME Compliance', stat4Value: '12.7%', problem: 'Market Problem', problemDesc: 'Overseas products lack Korean attack defense, AI Basic Law adaptation, and 9-region scenarios.', solution: 'Our Solution', solutionDesc: "Customized R&D for Daegu·Gyeongbuk filling Korea's AI safety gap." },
    innovation: { title: '4 Core Innovations', subtitle: 'Key Advantages for Judges', point1: { title: 'KWAI Korean AI Safety Standard', desc: "World's only AI Basic Law compliant S/A/B/C/D system covering 4 Korea-specific attack scenarios" }, point2: { title: '7-Tech Fusion Architecture', desc: 'Computer Vision+mmWave+Wearable+Thermal+Blockchain+Auto-Report+3D Digital Twin' }, point3: { title: '12 Autonomous AI Agents', desc: 'Detect→Decide→Act→Connect full autonomy, auto-reporting to Korea PIPC' }, point4: { title: '3D 9-Region Risk Map + AI', desc: 'Regional accident logs, AI Q&A, image hazard detection, auto improvement plans' } },
    features: { title: '8 Core Features', subtitle: 'Full-Cycle Industrial Safety Management', f1: { title: 'Real-Time Safety Control Center', desc: 'AI second-level risk detection, S/A high-risk pop-up alerts' }, f2: { title: 'Field Inspection Simulation', desc: 'Plan→Assign→Field→Improve→Verify full digitalization' }, f3: { title: 'Multi-Dimensional Big Data', desc: 'Cross-region/industry/risk analysis, monthly risk prediction' }, f4: { title: '3D Metaverse Cyber Range', desc: '4 Korean-style AI attack simulations, success rate measurement' }, f5: { title: 'National Accident DB', desc: 'NAVER/KAKAO/Samsung real accident database' }, f6: { title: 'AI Basic Law Dual Compliance', desc: 'Auto compliance checks, deadline notifications, legal alerts' }, f7: { title: '7-Tech Architecture Compare', desc: 'Tech stack breakdown + global 4 competitors comparison' }, f8: { title: 'Safety Gamification + ROI', desc: 'Safety point incentives + one-click ROI calculation' } },
    comparison: { title: 'Global Competitor Comparison', subtitle: "K-SAFE3D's Unmatched Advantage", ksafe: 'K-SAFE3D', openai: 'OpenAI Security', google: 'Google AI Safety', naver: 'NAVER CLOVA' },
    data: { title: 'Commercialization Data', subtitle: 'Scientifically Proven Business Viability', roi: 'ROI Analysis', roiDesc: '50-person company: 3 accidents/yr, ₩750M avg loss → Platform ₩12M/yr, ROI <4 months', market1: 'Daegu·Gyeongbuk Industrial Complexes', market2: 'Korean SME AI Companies', market3: 'Korean Local Gov Safety Depts' },
    cases: { title: 'Real-World Cases', subtitle: 'Proven Safety and Efficiency' },
    alert: { title: 'Real-Time Alert System', subtitle: 'Detect and Block Risks Before They Happen', level1: 'Low Alert', level2: 'Medium Alert', level3: 'High Alert', level4: 'Critical Alert' },
    auth: { login: 'Login', register: 'Register', email: 'Email Address', password: 'Password', submit: 'Submit', noAccount: "Don't have an account?", hasAccount: 'Already have an account?' },
    footer: { copyright: '© 2026 K-SAFE3D. Kyungwoon University AI Industrial Safety Lab. All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Service' }
  }
};

function Korea3DMap() {
  const meshRef = useRef<any>(null);
  useFrame((state) => { if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime * 0.1; });
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#8B5CF6" metalness={0.8} roughness={0.2} wireframe />
      </mesh>
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <mesh key={i} position={[Math.sin(i*0.7)*1.2, Math.cos(i*0.5)*0.8, Math.sin(i*0.3)*1.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={i%2===0?"#F59E0B":"#EF4444"} emissive={i%2===0?"#F59E0B":"#EF4444"} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </Float>
  );
}

function SteelPlant3D() {
  const groupRef = useRef<any>(null);
  useFrame((state) => { if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.05; });
  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2,0]}>
        <planeGeometry args={[20,20]} /><meshStandardMaterial color="#1E3A5F" metalness={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0,1,0]}><boxGeometry args={[8,4,6]} /><meshStandardMaterial color="#2563EB" metalness={0.5} roughness={0.3} /></mesh>
      <mesh position={[-3,3,0]}><cylinderGeometry args={[1,0.8,3,32]} /><meshStandardMaterial color="#DC2626" metalness={0.7} roughness={0.2} emissive="#DC2626" emissiveIntensity={0.3} /></mesh>
      <mesh position={[3,3,0]}><cylinderGeometry args={[1,0.8,3,32]} /><meshStandardMaterial color="#DC2626" metalness={0.7} roughness={0.2} emissive="#DC2626" emissiveIntensity={0.3} /></mesh>
      <mesh position={[-5,4,2]}><cylinderGeometry args={[0.5,0.5,6,32]} /><meshStandardMaterial color="#6B7280" /></mesh>
      <mesh position={[0,0.5,4]}><boxGeometry args={[6,1,2]} /><meshStandardMaterial color="#3B82F6" metalness={0.6} roughness={0.3} /></mesh>
    </group>
  );
}

function Particles() {
  const ref = useRef<any>(null);
  useFrame((state) => { if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03; });
  return (
    <group ref={ref}>
      {Array.from({length:80}).map((_,i) => (
        <mesh key={i} position={[(Math.random()-0.5)*30,(Math.random()-0.5)*30,(Math.random()-0.5)*30]}>
          <sphereGeometry args={[0.02,8,8]} />
          <meshStandardMaterial color={i%3===0?"#F59E0B":i%3===1?"#8B5CF6":"#10B981"} emissive={i%3===0?"#F59E0B":i%3===1?"#8B5CF6":"#10B981"} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function App() {
  const [language, setLanguage] = useState('ko');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAlert, setActiveAlert] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = (key: string) => {
    const keys = key.split('.');
    let v: any = translations[language];
    for (const k of keys) v = v?.[k];
    return v || key;
  };

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveAlert(Math.floor(Math.random()*4)+1), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const accidentTrendData = [
    { month: '1월', incidents: 98, loss: 245 },
    { month: '2월', incidents: 112, loss: 278 },
    { month: '3월', incidents: 134, loss: 321 },
    { month: '4월', incidents: 121, loss: 299 },
    { month: '5월', incidents: 145, loss: 356 },
    { month: '6월', incidents: 167, loss: 412 },
  ];

  const riskDistributionData = [
    { name: 'S급', value: 12, color: '#EF4444' },
    { name: 'A급', value: 35, color: '#F59E0B' },
    { name: 'B급', value: 87, color: '#8B5CF6' },
    { name: 'C급', value: 156, color: '#10B981' },
    { name: 'D급', value: 234, color: '#3B82F6' },
  ];

  const competitorData = [
    { feature: '한국어 특화공격', ksafe: 100, openai: 0, google: 0, naver: 40 },
    { feature: 'KWAI 안전규격', ksafe: 100, openai: 0, google: 0, naver: 30 },
    { feature: 'AI 기본법합규', ksafe: 100, openai: 0, google: 0, naver: 60 },
    { feature: '7테크 융합', ksafe: 100, openai: 20, google: 15, naver: 25 },
    { feature: '자율 AI 에이전트', ksafe: 100, openai: 10, google: 5, naver: 15 },
    { feature: '3D 디지털트윈', ksafe: 100, openai: 0, google: 0, naver: 0 },
  ];

  const converterData = [
    { id: 1, temperature: 1650, pressure: 12.5, status: 'running' },
    { id: 2, temperature: 1580, pressure: 11.8, status: 'running' },
    { id: 3, temperature: 0, pressure: 0, status: 'maintenance' },
  ];

  const consumptionData = [
    { time: '08:00', value: 1050 },{ time: '10:00', value: 1020 },{ time: '12:00', value: 980 },
    { time: '14:00', value: 1010 },{ time: '16:00', value: 990 },{ time: '18:00', value: 970 },
  ];

  const gasRecoveryData = [
    { time: '08:00', value: 3200 },{ time: '10:00', value: 3450 },{ time: '12:00', value: 3100 },
    { time: '14:00', value: 3600 },{ time: '16:00', value: 3380 },{ time: '18:00', value: 3520 },
  ];

  const productionData = [
    { name: '1월', production: 12400, consumption: 13200 },{ name: '2월', production: 13100, consumption: 13800 },
    { name: '3월', production: 14200, consumption: 14900 },{ name: '4월', production: 13800, consumption: 14500 },
    { name: '5월', production: 15100, consumption: 15700 },{ name: '6월', production: 14600, consumption: 15300 },
  ];

  const alertColors = ['','#10B981','#F59E0B','#EF4444','#7C3AED'];
  const alertBg = ['','bg-green-900/30','bg-yellow-900/30','bg-red-900/30','bg-purple-900/30'];
  const alertLevels = ['', t('alert.level1'), t('alert.level2'), t('alert.level3'), t('alert.level4')];

  const navItems = [
    {key:'home',label:t('nav.home')},{key:'background',label:t('nav.background')},
    {key:'innovation',label:t('nav.innovation')},{key:'features',label:t('nav.features')},
    {key:'digitalTwin',label:t('nav.digitalTwin')},{key:'comparison',label:t('nav.comparison')},
    {key:'data',label:t('nav.data')},{key:'cases',label:t('nav.cases')},{key:'alert',label:t('nav.alert')},
  ];

  const featureList = [
    {icon:<Shield size={22}/>,title:t('features.f1.title'),desc:t('features.f1.desc')},
    {icon:<Map size={22}/>,title:t('features.f2.title'),desc:t('features.f2.desc')},
    {icon:<BarChart3 size={22}/>,title:t('features.f3.title'),desc:t('features.f3.desc')},
    {icon:<Brain size={22}/>,title:t('features.f4.title'),desc:t('features.f4.desc')},
    {icon:<Database size={22}/>,title:t('features.f5.title'),desc:t('features.f5.desc')},
    {icon:<FileText size={22}/>,title:t('features.f6.title'),desc:t('features.f6.desc')},
    {icon:<Layers size={22}/>,title:t('features.f7.title'),desc:t('features.f7.desc')},
    {icon:<Target size={22}/>,title:t('features.f8.title'),desc:t('features.f8.desc')},
  ];

  const EyeIcon = showPassword ? EyeOff : Eye;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-gray-950 text-white" style={{fontFamily:'system-ui,sans-serif'}}>

        {/* NAV */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled?'bg-gray-900/95 backdrop-blur-md shadow-lg':'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-400" size={26}/>
              <span className="text-xl font-black" style={{background:'linear-gradient(to right,#60A5FA,#A78BFA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>K-SAFE3D</span>
            </div>
            <div className="hidden lg:flex items-center gap-5 text-sm">
              {navItems.map(n=><a key={n.key} href={`#${n.key}`} className="text-gray-300 hover:text-white transition-colors">{n.label}</a>)}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-700 rounded-lg overflow-hidden text-xs">
                {['ko','zh','en'].map(l=>(
                  <button key={l} onClick={()=>setLanguage(l)} className={`px-2 py-1 transition-colors ${language===l?'bg-blue-600 text-white':'text-gray-400 hover:text-white'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
              <button onClick={()=>setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm transition-colors">{t('auth.login')}</button>
              <button className="lg:hidden" onClick={()=>setIsMenuOpen(!isMenuOpen)}>{isMenuOpen?<X size={20}/>:<Menu size={20}/>}</button>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen&&(
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="lg:hidden bg-gray-900 border-t border-gray-800">
                {navItems.map(n=><a key={n.key} href={`#${n.key}`} onClick={()=>setIsMenuOpen(false)} className="block px-4 py-3 text-gray-300 hover:bg-gray-800 text-sm">{n.label}</a>)}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO */}
        <section id="home" style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0}}>
            <Canvas camera={{position:[0,0,8]}}>
              <ambientLight intensity={0.3}/>
              <pointLight position={[10,10,10]} intensity={1}/>
              <pointLight position={[-10,-10,-10]} color="#8B5CF6" intensity={0.5}/>
              <Stars radius={100} depth={50} count={3000} factor={4}/>
              <Particles/>
              <Korea3DMap/>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3}/>
            </Canvas>
          </div>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(3,7,18,0.3),transparent,rgb(3,7,18))'}}/>
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center w-full">
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm text-blue-300 rounded-full" style={{background:'rgba(37,99,235,0.2)',border:'1px solid rgba(59,130,246,0.3)'}}>
                <Zap size={14}/> {t('hero.title')}
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-4" style={{background:'linear-gradient(to right,#60A5FA,#A78BFA,#67E8F9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{t('hero.subtitle')}</h1>
              <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">{t('hero.description')}</p>
              <p className="text-sm text-gray-500 mb-8">{t('hero.student')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={()=>setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center transition-all hover:scale-105">
                  {t('hero.cta')} <ArrowRight size={18}/>
                </button>
                <button className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center transition-colors">
                  <Play size={18}/> {t('hero.demo')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BACKGROUND */}
        <section id="background" className="py-24" style={{background:'rgba(17,24,39,0.5)'}}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('background.title')}</h2>
              <p className="text-gray-400">{t('background.subtitle')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                {label:t('background.stat1'),value:t('background.stat1Value'),color:'#F87171',icon:<AlertTriangle size={22}/>},
                {label:t('background.stat2'),value:t('background.stat2Value'),color:'#FB923C',icon:<User size={22}/>},
                {label:t('background.stat3'),value:t('background.stat3Value'),color:'#FBBF24',icon:<DollarSign size={22}/>},
                {label:t('background.stat4'),value:t('background.stat4Value'),color:'#60A5FA',icon:<Building size={22}/>},
              ].map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}} className="rounded-2xl p-6 text-center" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                  <div style={{color:s.color}} className="mb-3 flex justify-center">{s.icon}</div>
                  <div className="text-3xl font-black mb-2" style={{color:s.color}}>{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6" style={{background:'rgba(127,29,29,0.2)',border:'1px solid rgba(153,27,27,0.4)'}}>
                <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={16}/>{t('background.problem')}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{t('background.problemDesc')}</p>
              </div>
              <div className="rounded-2xl p-6" style={{background:'rgba(6,78,59,0.2)',border:'1px solid rgba(6,95,70,0.4)'}}>
                <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2"><CheckCircle size={16}/>{t('background.solution')}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{t('background.solutionDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* INNOVATION */}
        <section id="innovation" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('innovation.title')}</h2>
              <p className="text-gray-400">{t('innovation.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {icon:<Shield size={30}/>,color:'#60A5FA',bg:'rgba(30,58,138,0.2)',border:'rgba(30,64,175,0.4)',title:t('innovation.point1.title'),desc:t('innovation.point1.desc'),tag:'01'},
                {icon:<Cpu size={30}/>,color:'#A78BFA',bg:'rgba(76,29,149,0.2)',border:'rgba(91,33,182,0.4)',title:t('innovation.point2.title'),desc:t('innovation.point2.desc'),tag:'02'},
                {icon:<Brain size={30}/>,color:'#67E8F9',bg:'rgba(8,145,178,0.15)',border:'rgba(14,165,233,0.3)',title:t('innovation.point3.title'),desc:t('innovation.point3.desc'),tag:'03'},
                {icon:<Map size={30}/>,color:'#FB923C',bg:'rgba(154,52,18,0.2)',border:'rgba(194,65,12,0.4)',title:t('innovation.point4.title'),desc:t('innovation.point4.desc'),tag:'04'},
              ].map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:i%2===0?-20:20}} whileInView={{opacity:1,x:0}} transition={{delay:i*0.1}} className="rounded-2xl p-8 relative overflow-hidden" style={{background:item.bg,border:`1px solid ${item.border}`}}>
                  <div className="absolute top-4 right-4 text-6xl font-black" style={{color:'rgba(255,255,255,0.04)'}}>{item.tag}</div>
                  <div style={{color:item.color}} className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24" style={{background:'rgba(17,24,39,0.5)'}}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('features.title')}</h2>
              <p className="text-gray-400">{t('features.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featureList.map((f,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.05}} className="rounded-2xl p-6 hover:-translate-y-1 transition-all" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                  <div className="text-blue-400 mb-4">{f.icon}</div>
                  <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DIGITAL TWIN */}
        <section id="digitalTwin" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('digitalTwin.title')}</h2>
              <p className="text-gray-400 mb-2">{t('digitalTwin.subtitle')}</p>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">{t('digitalTwin.description')}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl overflow-hidden" style={{height:400,background:'#111827',border:'1px solid #374151'}}>
                <Canvas camera={{position:[0,5,12]}}>
                  <ambientLight intensity={0.4}/><pointLight position={[10,10,10]} intensity={1}/><pointLight position={[-5,8,-5]} color="#3B82F6" intensity={0.8}/>
                  <SteelPlant3D/>
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5}/>
                </Canvas>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl p-5" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                  <h3 className="font-bold text-sm text-gray-300 mb-3">{t('digitalTwin.converterStatus')}</h3>
                  {converterData.map(c=>(
                    <div key={c.id} className="flex items-center justify-between rounded-xl p-3 text-xs mb-2" style={{background:'rgba(17,24,39,0.5)'}}>
                      <span className="text-gray-400">转炉 #{c.id}</span>
                      <div className="flex items-center gap-3">
                        {c.status==='running'&&<><span className="text-orange-400">{c.temperature}°C</span><span className="text-blue-400">{c.pressure}MPa</span></>}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${c.status==='running'?'text-green-400':'text-yellow-400'}`} style={{background:c.status==='running'?'rgba(6,78,59,0.5)':'rgba(113,63,18,0.5)'}}>
                          {t(`digitalTwin.${c.status}`)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-5" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                  <h3 className="font-bold text-sm text-gray-300 mb-3">{t('digitalTwin.consumptionChart')}</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={consumptionData}>
                      <XAxis dataKey="time" tick={{fill:'#6B7280',fontSize:10}}/><YAxis tick={{fill:'#6B7280',fontSize:10}}/>
                      <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8,fontSize:11}}/>
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                <h3 className="font-bold text-sm text-gray-300 mb-3">{t('digitalTwin.gasRecovery')}</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={gasRecoveryData}>
                    <XAxis dataKey="time" tick={{fill:'#6B7280',fontSize:10}}/><YAxis tick={{fill:'#6B7280',fontSize:10}}/>
                    <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8,fontSize:11}}/>
                    <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-2xl p-5" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                <h3 className="font-bold text-sm text-gray-300 mb-3">{t('digitalTwin.productionConsumption')}</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={productionData}>
                    <XAxis dataKey="name" tick={{fill:'#6B7280',fontSize:10}}/><YAxis tick={{fill:'#6B7280',fontSize:10}}/>
                    <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8,fontSize:11}}/>
                    <Bar dataKey="production" fill="#3B82F6" radius={[4,4,0,0]}/><Bar dataKey="consumption" fill="#8B5CF6" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section id="comparison" className="py-24" style={{background:'rgba(17,24,39,0.5)'}}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('comparison.title')}</h2>
              <p className="text-gray-400">{t('comparison.subtitle')}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={competitorData}>
                  <PolarGrid stroke="#374151"/><PolarAngleAxis dataKey="feature" tick={{fill:'#9CA3AF',fontSize:11}}/>
                  <PolarRadiusAxis tick={{fill:'#6B7280',fontSize:9}} domain={[0,100]}/>
                  <Radar name={t('comparison.ksafe')} dataKey="ksafe" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3}/>
                  <Radar name={t('comparison.openai')} dataKey="openai" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15}/>
                  <Radar name={t('comparison.google')} dataKey="google" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15}/>
                  <Radar name={t('comparison.naver')} dataKey="naver" stroke="#10B981" fill="#10B981" fillOpacity={0.15}/>
                  <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8}}/>
                </RadarChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {competitorData.map((d,i)=>(
                  <div key={i} className="rounded-xl p-4" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">{d.feature}</span>
                      <span className="text-blue-400 font-bold text-sm">K-SAFE: {d.ksafe}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{background:'#374151'}}>
                      <div className="h-1.5 rounded-full" style={{width:`${d.ksafe}%`,background:'#3B82F6'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DATA */}
        <section id="data" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('data.title')}</h2>
              <p className="text-gray-400">{t('data.subtitle')}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="rounded-2xl p-6" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                <h3 className="font-bold mb-4 text-gray-200">사고 발생 추이</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={accidentTrendData}>
                    <XAxis dataKey="month" tick={{fill:'#6B7280',fontSize:11}}/><YAxis tick={{fill:'#6B7280',fontSize:11}}/>
                    <CartesianGrid stroke="#374151" strokeDasharray="3 3"/>
                    <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8}}/>
                    <Area type="monotone" dataKey="incidents" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2}/>
                    <Area type="monotone" dataKey="loss" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-2xl p-6" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                <h3 className="font-bold mb-4 text-gray-200">위험등급 분포</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={180}>
                    <PieChart>
                      <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                        {riskDistributionData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{background:'#1F2937',border:'none',borderRadius:8}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {riskDistributionData.map((d,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{background:d.color}}/>
                        <span className="text-gray-400">{d.name}</span>
                        <span className="text-white font-bold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-6 lg:col-span-1" style={{background:'rgba(30,58,138,0.2)',border:'1px solid rgba(30,64,175,0.4)'}}>
                <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><TrendingUp size={15}/>{t('data.roi')}</h3>
                <p className="text-gray-300 text-xs leading-relaxed">{t('data.roiDesc')}</p>
              </div>
              {[t('data.market1'),t('data.market2'),t('data.market3')].map((m,i)=>(
                <div key={i} className="rounded-2xl p-6 flex items-center gap-3" style={{background:'rgba(31,41,55,0.6)',border:'1px solid #374151'}}>
                  <Target className="text-purple-400 flex-shrink-0" size={18}/>
                  <span className="text-sm text-gray-200">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASES */}
        <section id="cases" className="py-24" style={{background:'rgba(17,24,39,0.5)'}}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('cases.title')}</h2>
              <p className="text-gray-400">{t('cases.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {company:'삼성 SDI',region:'경기도',incident:'LLM 모델 백도어 공격',grade:'S급',result:'3.2억원 손실 방지',color:'#F87171',bg:'rgba(127,29,29,0.2)',border:'rgba(153,27,27,0.4)'},
                {company:'NAVER',region:'서울',incident:'AI 데이터 유출 시도',grade:'A급',result:'개인정보 87만건 보호',color:'#FB923C',bg:'rgba(120,53,15,0.2)',border:'rgba(146,64,14,0.4)'},
                {company:'대구 중소기업',region:'대구',incident:'이중컴플라이언스 위반',grade:'B급',result:'과태료 부과 사전 방지',color:'#FBBF24',bg:'rgba(113,63,18,0.2)',border:'rgba(133,77,14,0.4)'},
              ].map((c,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.1}} className="rounded-2xl p-6" style={{background:c.bg,border:`1px solid ${c.border}`}}>
                  <div className="flex justify-between items-start mb-4">
                    <div><div className="font-bold text-lg">{c.company}</div><div className="text-gray-400 text-sm">{c.region}</div></div>
                    <span className="font-black text-xl" style={{color:c.color}}>{c.grade}</span>
                  </div>
                  <div className="rounded-xl p-3 mb-3" style={{background:'rgba(17,24,39,0.5)'}}>
                    <div className="text-xs text-gray-400 mb-1">사고 유형</div>
                    <div className="text-sm">{c.incident}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle size={15}/> {c.result}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ALERT */}
        <section id="alert" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-3">{t('alert.title')}</h2>
              <p className="text-gray-400">{t('alert.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                {[1,2,3,4].map(level=>(
                  <motion.div key={level} animate={{scale:activeAlert===level?1.02:1}} className={`rounded-2xl p-5 transition-all cursor-pointer ${alertBg[level]}`} style={{border:`1px solid ${activeAlert===level?alertColors[level]:'#374151'}`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{background:alertColors[level]}}/>
                        <span className="font-bold">{alertLevels[level]}</span>
                      </div>
                      {activeAlert===level&&<div className="text-xs animate-pulse" style={{color:alertColors[level]}}>● ACTIVE</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-2xl p-6 font-mono text-xs space-y-2" style={{background:'#111827',border:'1px solid #374151'}}>
                <div className="text-gray-500 mb-4">{currentTime.toLocaleTimeString()} — K-SAFE3D Monitor</div>
                <div className="text-green-400">[INFO] 시스템 정상 운영 중</div>
                <div className="text-yellow-400">[WARN] 대구북구 LLM 비정상 접속 감지</div>
                <div className="text-red-400">[ALERT] S급 위험 이상행동 자동 차단</div>
                <div className="text-blue-400">[AUTO] 개선안 자동 생성 완료</div>
                <div className="text-purple-400">[REPORT] 개인정보보호위원회 자동 보고 완료</div>
                <div className="text-green-300 animate-pulse">[LIVE] 실시간 모니터링 활성화...</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10" style={{background:'#111827',borderTop:'1px solid #1F2937'}}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="text-blue-400" size={18}/><span className="font-bold">K-SAFE3D</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{t('footer.copyright')}</p>
            <div className="flex justify-center gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
        </footer>

        {/* AUTH MODAL */}
        <AnimatePresence>
          {showAuthModal&&(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}} onClick={()=>setShowAuthModal(false)}>
              <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="rounded-2xl p-8 w-full max-w-md" style={{background:'#111827',border:'1px solid #374151'}} onClick={e=>e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{authMode==='login'?t('auth.login'):t('auth.register')}</h2>
                  <button onClick={()=>setShowAuthModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={15}/>
                    <input type="email" placeholder={t('auth.email')} className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none" style={{background:'#1F2937',border:'1px solid #374151',color:'white'}}/>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={15}/>
                    <input type={showPassword?'text':'password'} placeholder={t('auth.password')} className="w-full rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none" style={{background:'#1F2937',border:'1px solid #374151',color:'white'}}/>
                    <button onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                      <EyeIcon size={15}/>
                    </button>
                  </div>
                  <button className="w-full py-3 rounded-xl font-semibold transition-colors" style={{background:'#2563EB'}}>{t('auth.submit')}</button>
                  <p className="text-center text-sm text-gray-400">
                    {authMode==='login'?t('auth.noAccount'):t('auth.hasAccount')}{' '}
                    <button onClick={()=>setAuthMode(authMode==='login'?'register':'login')} className="text-blue-400 hover:text-blue-300">
                      {authMode==='login'?t('auth.register'):t('auth.login')}
                    </button>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </LanguageContext.Provider>
  );
}
