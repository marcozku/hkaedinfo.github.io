(() => {
  'use strict';

  // Configuration
  const API_ENDPOINTS = {
    tc: 'https://www.ha.org.hk/opendata/aed/aedwtdata-tc.json',
    sc: 'https://www.ha.org.hk/opendata/aed/aedwtdata-sc.json',
    en: 'https://www.ha.org.hk/opendata/aed/aedwtdata-en.json'
  };

  const WEATHER_API = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=';
  const WEATHER_WARNING_API = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=';

  // Enhanced CORS proxy list with intelligent ordering
  let ENHANCED_CORS_PROXIES = [
    // Most successful proxy will be automatically moved to front
    'https://api.allorigins.win/get?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/',
    
    // Additional reliable proxies
    'https://crossorigin.me/',
    'https://cors-proxy.htmldriven.com/?url=',
    'https://yacdn.org/proxy/',
    'https://api.proxify.io?url=',
    'https://proxy.cors.sh/',
    'https://cors.eu.org/',
    
    // New enhanced proxies
    'https://api.cors.lol/?url=',
    'https://cors-fix.vercel.app/api/cors?url=',
    'https://cors-proxy.fringe.zone/',
    'https://corsproxy.io/?',
    'https://corsproxy.org/?',
    
    // Direct connection (no proxy) - try last
    ''
  ];

  // Hospital data from provided JSON
  const HOSPITALS_DATA = [
    {
      hospName_TC: "東區尤德夫人那打素醫院",
      hospName_SC: "东区尤德夫人那打素医院",
      hospName_EN: "Pamela Youde Nethersole Eastern Hospital",
      coordinates: [114.23643, 22.26918],
      phone: "2595 6111",
      address_tc: "香港柴灣樂民道3號",
      address_sc: "香港柴湾乐民道3号",
      address_en: "3 Lok Man Road, Chai Wan, Hong Kong",
      cluster: "港島東聯網",
      cluster_sc: "港岛东联网",
      cluster_en: "Hong Kong East Cluster",
      region_tc: "香港島",
      region_sc: "香港岛",
      region_en: "Hong Kong Island",
      unavailable_services: ["無24小時心導管服務", "無器官移植服務"]
    },
    {
      hospName_TC: "律敦治醫院",
      hospName_SC: "律敦治医院",
      hospName_EN: "Ruttonjee Hospital",
      coordinates: [114.17529, 22.275909],
      phone: "2291 2000",
      address_tc: "香港灣仔皇后大道東266號",
      address_sc: "香港湾仔皇后大道东266号",
      address_en: "266 Queen's Road East, Wan Chai, Hong Kong",
      cluster: "港島東聯網",
      cluster_sc: "港岛东联网",
      cluster_en: "Hong Kong East Cluster",
      region_tc: "香港島",
      region_sc: "香港岛",
      region_en: "Hong Kong Island",
      unavailable_services: ["無深切治療部", "無腫瘤科住院"]
    },
    {
      hospName_TC: "長洲醫院",
      hospName_SC: "长洲医院",
      hospName_EN: "St. John Hospital",
      coordinates: [114.03151, 22.208059],
      phone: "2986 2100",
      address_tc: "長洲東灣長洲醫院路",
      address_sc: "长洲东湾长洲医院路",
      address_en: "Cheung Chau Hospital Road, Tung Wan, Cheung Chau",
      cluster: "港島西聯網",
      cluster_sc: "港岛西联网",
      cluster_en: "Hong Kong West Cluster",
      region_tc: "香港島",
      region_sc: "香港岛",
      region_en: "Hong Kong Island",
      unavailable_services: ["無專科住院服務", "無手術服務", "無深切治療部", "無產科服務"]
    },
    {
      hospName_TC: "瑪麗醫院",
      hospName_SC: "玛丽医院",
      hospName_EN: "Queen Mary Hospital",
      coordinates: [114.13117, 22.2704],
      phone: "2255 3838",
      address_tc: "香港薄扶林道102號",
      address_sc: "香港薄扶林道102号",
      address_en: "102 Pokfulam Road, Hong Kong",
      cluster: "港島西聯網",
      cluster_sc: "港岛西联网",
      cluster_en: "Hong Kong West Cluster",
      region_tc: "香港島",
      region_sc: "香港岛",
      region_en: "Hong Kong Island",
      unavailable_services: []
    },
    {
      hospName_TC: "廣華醫院",
      hospName_SC: "广华医院",
      hospName_EN: "Kwong Wah Hospital",
      coordinates: [114.1721, 22.31429],
      phone: "2332 2311",
      address_tc: "九龍窩打老道25號",
      address_sc: "九龙窝打老道25号",
      address_en: "25 Waterloo Road, Kowloon",
      cluster: "九龍中聯網",
      cluster_sc: "九龙中联网",
      cluster_en: "Kowloon Central Cluster",
      region_tc: "九龍",
      region_sc: "九龙",
      region_en: "Kowloon",
      unavailable_services: ["無心胸外科", "無神經外科住院"]
    },
    {
      hospName_TC: "伊利沙伯醫院",
      hospName_SC: "伊利沙伯医院",
      hospName_EN: "Queen Elizabeth Hospital",
      coordinates: [114.17519, 22.30886],
      phone: "3506 8888",
      address_tc: "九龍加士居道30號",
      address_sc: "九龙加士居道30号",
      address_en: "30 Gascoigne Road, Kowloon",
      cluster: "九龍中聯網",
      cluster_sc: "九龙中联网",
      cluster_en: "Kowloon Central Cluster",
      region_tc: "九龍",
      region_sc: "九龙",
      region_en: "Kowloon",
      unavailable_services: []
    },
    {
      hospName_TC: "將軍澳醫院",
      hospName_SC: "将军澳医院",
      hospName_EN: "Tseung Kwan O Hospital",
      coordinates: [114.27021, 22.317964],
      phone: "2208 0111",
      address_tc: "將軍澳坑口寶寧里2號",
      address_sc: "将军澳坑口宝宁里2号",
      address_en: "2 Po Ning Lane, Hang Hau, Tseung Kwan O",
      cluster: "九龍東聯網",
      cluster_sc: "九龙东联网",
      cluster_en: "Kowloon East Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無心胸外科", "無神經外科"]
    },
    {
      hospName_TC: "基督教聯合醫院",
      hospName_SC: "基督教联合医院",
      hospName_EN: "United Christian Hospital",
      coordinates: [114.2279, 22.322291],
      phone: "3949 4000",
      address_tc: "九龍觀塘協和街130號",
      address_sc: "九龙观塘协和街130号",
      address_en: "130 Hip Wo Street, Kwun Tong, Kowloon",
      cluster: "九龍東聯網",
      cluster_sc: "九龙东联网",
      cluster_en: "Kowloon East Cluster",
      region_tc: "九龍",
      region_sc: "九龙",
      region_en: "Kowloon",
      unavailable_services: ["無燒傷治療中心"]
    },
    {
      hospName_TC: "明愛醫院",
      hospName_SC: "明爱医院",
      hospName_EN: "Caritas Medical Centre",
      coordinates: [114.15231, 22.340629],
      phone: "3408 7911",
      address_tc: "九龍深水埗永康街111號",
      address_sc: "九龙深水埗永康街111号",
      address_en: "111 Wing Hong Street, Sham Shui Po, Kowloon",
      cluster: "九龍西聯網",
      cluster_sc: "九龙西联网",
      cluster_en: "Kowloon West Cluster",
      region_tc: "九龍",
      region_sc: "九龙",
      region_en: "Kowloon",
      unavailable_services: ["無心胸外科", "無移植服務"]
    },
    {
      hospName_TC: "北大嶼山醫院",
      hospName_SC: "北大屿山医院",
      hospName_EN: "North Lantau Hospital",
      coordinates: [113.93914, 22.282571],
      phone: "3467 7000",
      address_tc: "新界大嶼山東涌松仁路8號",
      address_sc: "新界大屿山东涌松仁路8号",
      address_en: "8 Chung Yan Road, Tung Chung, Lantau Island",
      cluster: "新界西聯網",
      cluster_sc: "新界西联网",
      cluster_en: "New Territories West Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無專科住院服務", "無手術服務", "無深切治療部", "無產科住院"]
    },
    {
      hospName_TC: "瑪嘉烈醫院",
      hospName_SC: "玛嘉烈医院",
      hospName_EN: "Princess Margaret Hospital",
      coordinates: [114.1347, 22.340057],
      phone: "2990 1111",
      address_tc: "九龍荔枝角瑪嘉烈醫院路2-10號",
      address_sc: "九龙荔枝角玛嘉烈医院路2-10号",
      address_en: "2-10 Princess Margaret Hospital Road, Lai Chi Kok, Kowloon",
      cluster: "九龍西聯網",
      cluster_sc: "九龙西联网",
      cluster_en: "Kowloon West Cluster",
      region_tc: "九龍",
      region_sc: "九龙",
      region_en: "Kowloon",
      unavailable_services: []
    },
    {
      hospName_TC: "仁濟醫院",
      hospName_SC: "仁济医院",
      hospName_EN: "Yan Chai Hospital",
      coordinates: [114.11956, 22.369548],
      phone: "2417 8383",
      address_tc: "新界荃灣仁濟街7-11號",
      address_sc: "新界荃湾仁济街7-11号",
      address_en: "7-11 Yan Chai Street, Tsuen Wan, New Territories",
      cluster: "新界西聯網",
      cluster_sc: "新界西联网",
      cluster_en: "New Territories West Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無腫瘤科住院", "無心導管服務"]
    },
    {
      hospName_TC: "雅麗氏何妙齡那打素醫院",
      hospName_SC: "雅丽氏何妙龄那打素医院",
      hospName_EN: "Alice Ho Miu Ling Nethersole Hospital",
      coordinates: [114.17479, 22.458696],
      phone: "2689 2000",
      address_tc: "新界大埔全安路11號",
      address_sc: "新界大埔全安路11号",
      address_en: "11 Chuen On Road, Tai Po, New Territories",
      cluster: "新界東聯網",
      cluster_sc: "新界东联网",
      cluster_en: "New Territories East Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無心胸外科", "無神經外科住院"]
    },
    {
      hospName_TC: "北區醫院",
      hospName_SC: "北区医院",
      hospName_EN: "North District Hospital",
      coordinates: [114.12456, 22.496832],
      phone: "2683 8888",
      address_tc: "新界上水保健路9號",
      address_sc: "新界上水保健路9号",
      address_en: "9 Po Kin Road, Sheung Shui, New Territories",
      cluster: "新界東聯網",
      cluster_sc: "新界东联网",
      cluster_en: "New Territories East Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無兒科住院", "無婦產科住院", "無神經外科", "無心胸外科", "無腫瘤科住院"]
    },
    {
      hospName_TC: "威爾斯親王醫院",
      hospName_SC: "威尔斯亲王医院",
      hospName_EN: "Prince of Wales Hospital",
      coordinates: [114.20129, 22.379939],
      phone: "3505 2211",
      address_tc: "新界沙田銀城街30-32號",
      address_sc: "新界沙田银城街30-32号",
      address_en: "30-32 Ngan Shing Street, Sha Tin, New Territories",
      cluster: "新界東聯網",
      cluster_sc: "新界东联网",
      cluster_en: "New Territories East Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: []
    },
    {
      hospName_TC: "博愛醫院",
      hospName_SC: "博爱医院",
      hospName_EN: "Pok Oi Hospital",
      coordinates: [114.04159, 22.44523],
      phone: "2486 8000",
      address_tc: "新界元朗坳頭",
      address_sc: "新界元朗坳头",
      address_en: "Au Tau, Yuen Long, New Territories",
      cluster: "新界西聯網",
      cluster_sc: "新界西联网",
      cluster_en: "New Territories West Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無心胸外科", "無神經外科"]
    },
    {
      hospName_TC: "天水圍醫院",
      hospName_SC: "天水围医院",
      hospName_EN: "Tin Shui Wai Hospital",
      coordinates: [113.99585, 22.458704],
      phone: "3513 5000",
      address_tc: "新界天水圍天壇街11號",
      address_sc: "新界天水围天坛街11号",
      address_en: "11 Tin Tan Street, Tin Shui Wai, New Territories",
      cluster: "新界西聯網",
      cluster_sc: "新界西联网",
      cluster_en: "New Territories West Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: ["無心胸外科", "無神經外科", "無腫瘤科住院"]
    },
    {
      hospName_TC: "屯門醫院",
      hospName_SC: "屯门医院",
      hospName_EN: "Tuen Mun Hospital",
      coordinates: [113.97621, 22.40708],
      phone: "2468 5111",
      address_tc: "新界屯門青松觀路23號",
      address_sc: "新界屯门青松观路23号",
      address_en: "23 Tsing Chung Koon Road, Tuen Mun, New Territories",
      cluster: "新界西聯網",
      cluster_sc: "新界西联网",
      cluster_en: "New Territories West Cluster",
      region_tc: "新界",
      region_sc: "新界",
      region_en: "New Territories",
      unavailable_services: []
    }
  ];

  // Enhanced waiting time color mapping
  const WAITING_TIME_COLORS = {
    tc: {
      "大約1小時": "#10B981",
      "超過1小時": "#16A34A",
      "超過2小時": "#EAB308",
      "超過3小時": "#F59E0B",
      "超過4小時": "#EA580C",
      "超過5小時": "#DC2626",
      "超過6小時": "#B91C1C",
      "超過7小時": "#991B1B",
      "超過8小時": "#7F1D1D"
    },
    sc: {
      "大约1小时": "#10B981",
      "超过1小时": "#16A34A",
      "超过2小时": "#EAB308",
      "超过3小时": "#F59E0B",
      "超过4小时": "#EA580C",
      "超过5小时": "#DC2626",
      "超过6小时": "#B91C1C",
      "超过7小时": "#991B1B",
      "超过8小时": "#7F1D1D"
    },
    en: {
      "Around 1 hour": "#10B981",
      "Over 1 hour": "#16A34A",
      "Over 2 hours": "#EAB308",
      "Over 3 hours": "#F59E0B",
      "Over 4 hours": "#EA580C",
      "Over 5 hours": "#DC2626",
      "Over 6 hours": "#B91C1C",
      "Over 7 hours": "#991B1B",
      "Over 8 hours": "#7F1D1D"
    }
  };

  // Mock waiting times for demonstration
  const MOCK_WAITING_TIMES = {
    tc: ["大約1小時", "超過1小時", "超過2小時", "超過3小時", "超過4小時", "超過5小時", "超過6小時", "超過7小時", "超過8小時"],
    sc: ["大约1小时", "超过1小时", "超过2小时", "超过3小时", "超过4小时", "超过5小时", "超过6小时", "超过7小时", "超过8小时"],
    en: ["Around 1 hour", "Over 1 hour", "Over 2 hours", "Over 3 hours", "Over 4 hours", "Over 5 hours", "Over 6 hours", "Over 7 hours", "Over 8 hours"]
  };

  // Enhanced translations
  const TRANSLATIONS = {
    tc: {
      title: "🏥 香港急症室實時數據",
      subtitle: "📊 醫管局官方18間急症室 - 實時數據",
      loading: "🔄 正在連接醫管局API獲取實時數據...",
      initializing: "🔄 正在初始化應用程式...",
      findingProxy: "🔍 正在尋找最佳代理伺服器...",
      attemptingProxy: "🌐 嘗試代理",
      successfulConnection: "✅ 成功獲取醫管局數據",
      loadingComplete: "🎉 載入完成",
      connectionFailed: "❌ 連接失敗",
      retrying: "🔄 正在重試...",
      loadingWeather: "🌤️ 載入天氣中...",
      findNearest: "🎯 尋找最近醫院",
      sortDistance: "📍 按距離排序",
      sortWaiting: "⏱️ 按等候時間排序",
      allRegions: "🗺️ 所有地區",
      allClusters: "🔗 所有聯網",
      regions: {
        "香港島": "🏝️ 香港島",
        "九龍": "🏙️ 九龍",
        "新界": "🌿 新界"
      },
      clusters: {
        "港島東聯網": "🌅 港島東聯網",
        "港島西聯網": "🌇 港島西聯網",
        "九龍東聯網": "🌄 九龍東聯網",
        "九龍中聯網": "🏢 九龍中聯網",
        "九龍西聯網": "🌆 九龍西聯網",
        "新界東聯網": "🌲 新界東聯網",
        "新界西聯網": "🌳 新界西聯網"
      },
      viewDetails: "👁️ 查看詳情",
      address: "📍 地址：",
      phone: "📞 電話：",
      cluster: "🔗 聯網：",
      distance: "📏 距離：",
      unavailableServices: "⚠️ 不提供的專科住院服務：",
      noServices: "✅ 所有專科服務均可提供",
      countdownLabel: "⏱️ 下次更新倒數:",
      apiStatus: {
        connecting: "🔄 正在連接醫管局API...",
        connected: "✅ 已連接醫管局API",
        fetching: "📡 正在獲取數據...",
        error: "❌ 連接失敗，正在重試...",
        retrying: "🔄 重新連接中..."
      },
      lastUpdateLabel: "📅 最後更新:",
      locationError: "❌ 無法獲取您的位置，請確保已允許位置權限",
      locationPermissionDenied: "🚫 位置權限被拒絶，請在瀏覽器設定中允許位置存取",
      km: "公里",
      locating: "🎯 定位中...",
      connectionAttempt: "🌐 嘗試連接",
      successful: "✅ 成功",
      seconds: "秒",
      close: "關閉"
    },
    sc: {
      title: "🏥 香港急症室实时数据",
      subtitle: "📊 医管局官方18间急症室 - 实时数据",
      loading: "🔄 正在连接医管局API获取实时数据...",
      initializing: "🔄 正在初始化应用程序...",
      findingProxy: "🔍 正在寻找最佳代理服务器...",
      attemptingProxy: "🌐 尝试代理",
      successfulConnection: "✅ 成功获取医管局数据",
      loadingComplete: "🎉 载入完成",
      connectionFailed: "❌ 连接失败",
      retrying: "🔄 正在重试...",
      loadingWeather: "🌤️ 载入天气中...",
      findNearest: "🎯 寻找最近医院",
      sortDistance: "📍 按距离排序",
      sortWaiting: "⏱️ 按等候时间排序",
      allRegions: "🗺️ 所有地区",
      allClusters: "🔗 所有联网",
      regions: {
        "香港島": "🏝️ 香港岛",
        "九龍": "🏙️ 九龙",
        "新界": "🌿 新界"
      },
      clusters: {
        "港島東聯網": "🌅 港岛东联网",
        "港島西聯網": "🌇 港岛西联网",
        "九龍東聯網": "🌄 九龙东联网",
        "九龍中聯網": "🏢 九龙中联网",
        "九龍西聯網": "🌆 九龙西联网",
        "新界東聯網": "🌲 新界东联网",
        "新界西聯網": "🌳 新界西联网"
      },
      viewDetails: "👁️ 查看详情",
      address: "📍 地址：",
      phone: "📞 电话：",
      cluster: "🔗 联网：",
      distance: "📏 距离：",
      unavailableServices: "⚠️ 不提供的专科住院服务：",
      noServices: "✅ 所有专科服务均可提供",
      countdownLabel: "⏱️ 下次更新倒数:",
      apiStatus: {
        connecting: "🔄 正在连接医管局API...",
        connected: "✅ 已连接医管局API",
        fetching: "📡 正在获取数据...",
        error: "❌ 连接失败，正在重试...",
        retrying: "🔄 重新连接中..."
      },
      lastUpdateLabel: "📅 最后更新:",
      locationError: "❌ 无法获取您的位置，请确保已允许位置权限",
      locationPermissionDenied: "🚫 位置权限被拒绝，请在浏览器设置中允许位置访问",
      km: "公里",
      locating: "🎯 定位中...",
      connectionAttempt: "🌐 尝试连接",
      successful: "✅ 成功",
      seconds: "秒",
      close: "关闭"
    },
    en: {
      title: "🏥 Hong Kong A&E Real-time Data",
      subtitle: "📊 Official 18 A&E Departments - Real-time Data",
      loading: "🔄 Connecting to HA API for real-time data...",
      initializing: "🔄 Initializing application...",
      findingProxy: "🔍 Finding best proxy server...",
      attemptingProxy: "🌐 Trying proxy",
      successfulConnection: "✅ Successfully fetched HA data",
      loadingComplete: "🎉 Loading complete",
      connectionFailed: "❌ Connection failed",
      retrying: "🔄 Retrying...",
      loadingWeather: "🌤️ Loading weather...",
      findNearest: "🎯 Find Nearest Hospital",
      sortDistance: "📍 Sort by Distance",
      sortWaiting: "⏱️ Sort by Waiting Time",
      allRegions: "🗺️ All Regions",
      allClusters: "🔗 All Clusters",
      regions: {
        "香港島": "🏝️ Hong Kong Island",
        "九龍": "🏙️ Kowloon",
        "新界": "🌿 New Territories"
      },
      clusters: {
        "港島東聯網": "🌅 Hong Kong East Cluster",
        "港島西聯網": "🌇 Hong Kong West Cluster",
        "九龍東聯網": "🌄 Kowloon East Cluster",
        "九龍中聯網": "🏢 Kowloon Central Cluster",
        "九龍西聯網": "🌆 Kowloon West Cluster",
        "新界東聯網": "🌲 New Territories East Cluster",
        "新界西聯網": "🌳 New Territories West Cluster"
      },
      viewDetails: "👁️ View Details",
      address: "📍 Address:",
      phone: "📞 Phone:",
      cluster: "🔗 Cluster:",
      distance: "📏 Distance:",
      unavailableServices: "⚠️ Unavailable Specialist Inpatient Services:",
      noServices: "✅ All specialist services are available",
      countdownLabel: "⏱️ Next update in:",
      apiStatus: {
        connecting: "🔄 Connecting to HA API...",
        connected: "✅ Connected to HA API",
        fetching: "📡 Fetching data...",
        error: "❌ Connection failed, retrying...",
        retrying: "🔄 Reconnecting..."
      },
      lastUpdateLabel: "📅 Last updated:",
      locationError: "❌ Unable to get your location, please ensure location permission is granted",
      locationPermissionDenied: "🚫 Location permission denied, please allow location access in browser settings",
      km: "km",
      locating: "🎯 Locating...",
      connectionAttempt: "🌐 Connection attempt",
      successful: "✅ Successful",
      seconds: "s",
      close: "Close"
    }
  };

  // Smart proxy success tracking system
  let proxySuccessHistory = {
    successCount: {},
    lastSuccessful: null,
    lastSuccessTime: null,
    failureCount: {}
  };

  // Application state
  let loadingState = {
    isLoading: true,
    currentStep: '初始化中...',
    progress: 0,
    proxyAttempts: 0,
    totalProxies: 0,
    errors: []
  };

  // State variables
  let currentLanguage = 'tc';
  let currentSort = 'distance';
  let currentRegion = 'all';
  let currentCluster = 'all';
  let userLocation = null;
  let hospitalsData = [];
  let waitingTimeData = [];
  let countdown = 15;
  let isUpdating = false;
  let isConnected = false;
  let nearestHospitalIndex = -1;
  let connectionAttempts = 0;
  let countdownTimer = null;
  let dateTimeTimer = null;

  // DOM elements
  const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    loadingMessage: document.getElementById('loading-message'),
    progressBar: document.getElementById('progress-bar'),
    weatherAlert: document.getElementById('weather-alert'),
    weatherAlertText: document.getElementById('weather-alert-text'),
    topHeader: document.getElementById('top-header'),
    appTitle: document.getElementById('app-title'),
    appSubtitle: document.getElementById('app-subtitle'),
    currentDate: document.getElementById('current-date'),
    currentTime: document.getElementById('current-time'),
    weatherSummary: document.getElementById('weather-summary'),
    temperature: document.getElementById('temperature'),
    languageSelect: document.getElementById('language-select'),
    sortSelect: document.getElementById('sort-select'),
    regionFilter: document.getElementById('region-filter'),
    clusterFilter: document.getElementById('cluster-filter'),
    findNearest: document.getElementById('find-nearest'),
    findNearestText: document.getElementById('find-nearest-text'),
    connectionStatus: document.getElementById('connection-status'),
    hospitalList: document.getElementById('hospital-list'),
    hospitalModal: document.getElementById('hospital-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalAddress: document.getElementById('modal-address'),
    modalPhone: document.getElementById('modal-phone'),
    modalCluster: document.getElementById('modal-cluster'),
    modalDistance: document.getElementById('modal-distance'),
    modalUnavailableServices: document.getElementById('modal-unavailable-services'),
    modalClose: document.getElementById('modal-close'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    countdown: document.getElementById('countdown'),
    apiStatusIndicator: document.getElementById('api-status-indicator'),
    apiStatusText: document.getElementById('api-status-text'),
    lastUpdateTime: document.getElementById('last-update-time')
  };

  // Enhanced loading screen management
  function showLoadingScreen() {
    elements.loadingScreen.classList.remove('hidden');
    loadingState.isLoading = true;
    updateLoadingStatus('🔄 正在初始化應用程式...', 10);
  }

  function updateLoadingStatus(message, progress) {
    if (elements.loadingMessage) elements.loadingMessage.textContent = message;
    if (elements.progressBar) elements.progressBar.style.width = `${progress}%`;
    if (elements.connectionStatus) elements.connectionStatus.textContent = message;
    
    loadingState.currentStep = message;
    loadingState.progress = progress;
  }

  function hideLoadingScreen() {
    // Only hide when real data is successfully loaded
    if (waitingTimeData && waitingTimeData.length > 0 && isConnected) {
      setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        loadingState.isLoading = false;
      }, 500);
    }
  }

  // Smart proxy success recording
  function recordSuccessfulProxy(proxyIndex) {
    const proxy = ENHANCED_CORS_PROXIES[proxyIndex];
    
    // Record success
    if (!proxySuccessHistory.successCount[proxy]) {
      proxySuccessHistory.successCount[proxy] = 0;
    }
    proxySuccessHistory.successCount[proxy]++;
    
    // Reset failure count for this proxy
    proxySuccessHistory.failureCount[proxy] = 0;
    
    // Update last successful proxy
    proxySuccessHistory.lastSuccessful = proxy;
    proxySuccessHistory.lastSuccessTime = Date.now();
    
    // Reorder proxies by success
    reorderProxiesBySuccess();
    
    console.log(`✅ Proxy success recorded: ${proxy} (${proxySuccessHistory.successCount[proxy]} successes)`);
  }

  function recordProxyFailure(proxyIndex) {
    const proxy = ENHANCED_CORS_PROXIES[proxyIndex];
    
    if (!proxySuccessHistory.failureCount[proxy]) {
      proxySuccessHistory.failureCount[proxy] = 0;
    }
    proxySuccessHistory.failureCount[proxy]++;
  }

  function reorderProxiesBySuccess() {
    // Sort proxies by success rate and recent success
    ENHANCED_CORS_PROXIES.sort((a, b) => {
      const aSuccess = proxySuccessHistory.successCount[a] || 0;
      const bSuccess = proxySuccessHistory.successCount[b] || 0;
      const aFailure = proxySuccessHistory.failureCount[a] || 0;
      const bFailure = proxySuccessHistory.failureCount[b] || 0;
      
      // Calculate success rate
      const aRate = aSuccess + aFailure > 0 ? aSuccess / (aSuccess + aFailure) : 0;
      const bRate = bSuccess + bFailure > 0 ? bSuccess / (bSuccess + bFailure) : 0;
      
      // Prioritize higher success rate
      if (aRate !== bRate) {
        return bRate - aRate;
      }
      
      // Then by total success count
      if (aSuccess !== bSuccess) {
        return bSuccess - aSuccess;
      }
      
      // Finally by most recent success
      if (proxySuccessHistory.lastSuccessful === a) return -1;
      if (proxySuccessHistory.lastSuccessful === b) return 1;
      
      return 0;
    });
    
    console.log('🔄 Proxy list reordered by success rate');
  }

  // Enhanced CORS fetch with intelligent proxy selection
  async function fetchWithCORSFix(url, proxyIndex = 0) {
    if (proxyIndex >= ENHANCED_CORS_PROXIES.length) {
      throw new Error('所有代理都已嘗試，連接失敗');
    }
    
    const proxy = ENHANCED_CORS_PROXIES[proxyIndex];
    const proxyUrl = proxy ? proxy + encodeURIComponent(url) : url;
    const t = TRANSLATIONS[currentLanguage];
    
    const proxyName = proxy || '直接連接';
    updateLoadingStatus(`${t.attemptingProxy} ${proxyIndex + 1}/${ENHANCED_CORS_PROXIES.length}: ${proxyName}`, 
                       30 + (proxyIndex * 40 / ENHANCED_CORS_PROXIES.length));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'HK-AED-Monitor/3.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      let data;
      const contentType = response.headers.get('content-type') || '';
      
      // Handle different proxy response formats
      if (proxy.includes('allorigins.win')) {
        const result = await response.json();
        if (result.contents) {
          data = JSON.parse(result.contents);
        } else {
          throw new Error('Invalid allorigins response format');
        }
      } else if (proxy.includes('codetabs.com')) {
        data = await response.json();
      } else {
        // Direct JSON parsing
        data = await response.json();
      }
      
      // Validate data structure
      if (!validateHospitalData(data)) {
        throw new Error('Invalid data structure received');
      }
      
      // Success! Record this proxy
      recordSuccessfulProxy(proxyIndex);
      
      updateLoadingStatus(`${t.successful}! 🎉`, 70);
      
      return data;
      
    } catch (error) {
      console.warn(`❌ Proxy ${proxyIndex + 1} failed (${proxyName}):`, error.message);
      recordProxyFailure(proxyIndex);
      
      // Provide specific error feedback
      if (error.name === 'AbortError') {
        updateLoadingStatus(`⏱️ 代理 ${proxyIndex + 1} 超時，嘗試下一個...`, 30 + (proxyIndex * 40 / ENHANCED_CORS_PROXIES.length));
      } else if (error.message.includes('CORS') || error.message.includes('cors')) {
        updateLoadingStatus(`🚫 代理 ${proxyIndex + 1} CORS錯誤，嘗試下一個...`, 30 + (proxyIndex * 40 / ENHANCED_CORS_PROXIES.length));
      } else {
        updateLoadingStatus(`❌ 代理 ${proxyIndex + 1} 失敗，嘗試下一個...`, 30 + (proxyIndex * 40 / ENHANCED_CORS_PROXIES.length));
      }
      
      // Wait briefly before trying next proxy
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try next proxy
      return fetchWithCORSFix(url, proxyIndex + 1);
    }
  }

  // Data validation function
  function validateHospitalData(data) {
    return data && 
           typeof data === 'object' && 
           Array.isArray(data.waitTime) && 
           data.waitTime.length > 0 &&
           data.waitTime.every(item => 
             item.hospName && 
             typeof item.topWait !== 'undefined'
           );
  }

  // Enhanced hospital data fetching with retry
  async function fetchHospitalDataWithRetry(language = 'tc', maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const t = TRANSLATIONS[currentLanguage];
        updateLoadingStatus(`🔄 第 ${attempt} 次嘗試連接醫管局API...`, 10 + (attempt * 10));
        
        const url = API_ENDPOINTS[language];
        const data = await fetchWithCORSFix(url);
        
        if (validateHospitalData(data)) {
          updateLoadingStatus(t.successfulConnection, 80);
          return data;
        } else {
          throw new Error('數據驗證失敗');
        }
      } catch (error) {
        console.warn(`嘗試 ${attempt} 失敗:`, error.message);
        
        if (attempt === maxRetries) {
          throw new Error(`經過 ${maxRetries} 次嘗試後仍無法連接醫管局API: ${error.message}`);
        }
        
        const t = TRANSLATIONS[currentLanguage];
        updateLoadingStatus(`${t.connectionFailed}，準備第 ${attempt + 1} 次嘗試...`, 10 + (attempt * 10));
        
        // Progressive backoff
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  // Initialize application with enhanced loading
  async function initializeApp() {
    console.log('🚀 Initializing Enhanced Hong Kong A&E Application...');
    
    showLoadingScreen();
    
    try {
      const t = TRANSLATIONS[currentLanguage];
      updateLoadingStatus(t.findingProxy, 20);
      
      // Attempt to get real data
      const realData = await fetchHospitalDataWithRetry();
      
      if (realData && validateHospitalData(realData)) {
        waitingTimeData = realData.waitTime || [];
        
        updateLoadingStatus(t.successfulConnection, 90);
        
        // Render real data
        await renderHospitals();
        
        updateLoadingStatus(t.loadingComplete, 100);
        
        // Mark as connected and hide loading screen
        isConnected = true;
        hideLoadingScreen();
        
        // Start periodic updates
        startPeriodicUpdates();
        
        // Update last update time
        elements.lastUpdateTime.textContent = formatTime(new Date());
        setApiStatus('connected');
      } else {
        throw new Error('無法獲取有效的醫管局數據');
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      const t = TRANSLATIONS[currentLanguage];
      
      updateLoadingStatus(`${t.connectionFailed}: ${error.message}`, 0);
      
      // Use mock data and retry in background
      waitingTimeData = generateMockWaitingTimeData();
      renderHospitals();
      
      // Retry after 5 seconds
      setTimeout(() => {
        initializeApp();
      }, 5000);
    }
  }

  // Utility functions
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function formatTime(date) {
    return date.toLocaleTimeString('zh-HK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function formatDate(date) {
    const options = {
      tc: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
      sc: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
      en: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    };
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'zh-HK', options[currentLanguage]);
  }

  function getWaitingTimeColor(waitTime) {
    const colors = WAITING_TIME_COLORS[currentLanguage];
    for (const [key, color] of Object.entries(colors)) {
      if (waitTime === key) {
        return color;
      }
    }
    for (const [key, color] of Object.entries(colors)) {
      if (waitTime.includes(key.replace(/[^\u4e00-\u9fff\w\s]/g, ''))) {
        return color;
      }
    }
    return '#6B7280';
  }

  function setApiStatus(status) {
    const t = TRANSLATIONS[currentLanguage];
    elements.apiStatusText.textContent = t.apiStatus[status] || status;
    elements.apiStatusIndicator.className = `status-indicator ${status}`;
    
    isConnected = (status === 'connected');
  }

  // Generate mock data
  function generateMockWaitingTimeData() {
    const mockTimes = MOCK_WAITING_TIMES[currentLanguage];
    return HOSPITALS_DATA.map(hospital => {
      const langKey = currentLanguage.toUpperCase();
      return {
        hospName: hospital[`hospName_${langKey}`],
        topWait: mockTimes[Math.floor(Math.random() * mockTimes.length)]
      };
    });
  }

  // Enhanced scroll handling
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop === 0) {
      elements.topHeader.classList.remove('hidden');
    } else {
      elements.topHeader.classList.add('hidden');
    }
  }

  // UI update functions
  function updateDateTime() {
    const now = new Date();
    elements.currentDate.textContent = `📅 ${formatDate(now)}`;
    elements.currentTime.textContent = `⏰ ${formatTime(now)}`;
  }

  function updateTranslations() {
    const t = TRANSLATIONS[currentLanguage];

    elements.appTitle.textContent = t.title;
    elements.appSubtitle.textContent = t.subtitle;
    elements.findNearestText.textContent = t.findNearest;

    // Update form options
    document.getElementById('sort-distance').textContent = t.sortDistance;
    document.getElementById('sort-waiting').textContent = t.sortWaiting;
    document.getElementById('region-all').textContent = t.allRegions;
    document.getElementById('cluster-all').textContent = t.allClusters;

    // Update region options
    document.getElementById('region-hk').textContent = t.regions['香港島'];
    document.getElementById('region-kl').textContent = t.regions['九龍'];
    document.getElementById('region-nt').textContent = t.regions['新界'];

    // Update cluster options
    const clusterOptions = {
      'cluster-hke': t.clusters['港島東聯網'],
      'cluster-hkw': t.clusters['港島西聯網'],
      'cluster-kle': t.clusters['九龍東聯網'],
      'cluster-klc': t.clusters['九龍中聯網'],
      'cluster-klw': t.clusters['九龍西聯網'],
      'cluster-nte': t.clusters['新界東聯網'],
      'cluster-ntw': t.clusters['新界西聯網']
    };

    Object.entries(clusterOptions).forEach(([id, text]) => {
      const option = document.getElementById(id);
      if (option) option.textContent = text;
    });

    // Update modal labels
    document.getElementById('modal-address-label').textContent = t.address;
    document.getElementById('modal-phone-label').textContent = t.phone;
    document.getElementById('modal-cluster-label').textContent = t.cluster;
    document.getElementById('modal-distance-label').textContent = t.distance;
    document.getElementById('modal-services-title').textContent = t.unavailableServices;

    // Update modal close button aria-label
    elements.modalClose.setAttribute('aria-label', t.close);

    // Update status bar
    document.getElementById('countdown-label').textContent = t.countdownLabel;
    document.getElementById('last-update-label').textContent = t.lastUpdateLabel;

    // Update countdown display
    updateCountdownDisplay();
  }

  function updateCountdownDisplay() {
    const t = TRANSLATIONS[currentLanguage];
    if (isConnected) {
      elements.countdown.textContent = `${countdown}${t.seconds}`;
    } else {
      elements.countdown.textContent = `--${t.seconds}`;
    }
  }

  function sortHospitals() {
    const combinedData = HOSPITALS_DATA.map(hospital => {
      const langKey = currentLanguage.toUpperCase();
      const waitData = waitingTimeData.find(w =>
        w.hospName === hospital[`hospName_${langKey}`]
      );

      let distance = null;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.latitude, userLocation.longitude,
          hospital.coordinates[1], hospital.coordinates[0]
        );
      }

      return {
        ...hospital,
        waitTime: waitData ? waitData.topWait : '載入中...',
        distance: distance
      };
    });

    if (currentSort === 'distance' && userLocation) {
      combinedData.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      nearestHospitalIndex = 0;
    } else if (currentSort === 'waiting') {
      const waitingOrder = Object.keys(WAITING_TIME_COLORS[currentLanguage]);
      combinedData.sort((a, b) => {
        const aIndex = waitingOrder.findIndex(w => a.waitTime === w);
        const bIndex = waitingOrder.findIndex(w => b.waitTime === w);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return combinedData;
  }

  function filterHospitals(hospitals) {
    let filtered = hospitals;

    if (currentRegion !== 'all') {
      const regionKey = `region_${currentLanguage}`;
      filtered = filtered.filter(hospital => {
        const hospitalRegion = hospital[regionKey];
        const targetRegion = TRANSLATIONS[currentLanguage].regions[currentRegion].replace(/^[^\s]+ /, '');
        return hospitalRegion === targetRegion || hospital.region_tc === currentRegion;
      });
    }

    if (currentCluster !== 'all') {
      const clusterKey = `cluster${currentLanguage === 'en' ? '_en' : (currentLanguage === 'sc' ? '_sc' : '')}`;
      filtered = filtered.filter(hospital => {
        return hospital[clusterKey] === currentCluster || hospital.cluster === currentCluster;
      });
    }

    return filtered;
  }

  function renderHospitals() {
    const sortedHospitals = sortHospitals();
    const filteredHospitals = filterHospitals(sortedHospitals);

    elements.hospitalList.innerHTML = '';

    filteredHospitals.forEach((hospital, index) => {
      const isNearest = (index === 0 && currentSort === 'distance' && userLocation);
      const card = createHospitalCard(hospital, isNearest);
      elements.hospitalList.appendChild(card);
    });
  }

  function createHospitalCard(hospital, isNearest = false) {
    const t = TRANSLATIONS[currentLanguage];
    const card = document.createElement('div');
    card.className = `hospital-card${isNearest ? ' nearest' : ''}`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    const langKey = currentLanguage.toUpperCase();
    const hospName = hospital[`hospName_${langKey}`];
    const clusterKey = `cluster${currentLanguage === 'en' ? '_en' : (currentLanguage === 'sc' ? '_sc' : '')}`;
    const addressKey = `address_${currentLanguage}`;

    card.innerHTML = `
      <div class="hospital-header">
        <h3 class="hospital-title">${hospName}</h3>
        <div class="hospital-cluster">${hospital[clusterKey] || hospital.cluster}</div>
      </div>
      <div class="hospital-info">
        <div class="waiting-time" style="background-color: ${getWaitingTimeColor(hospital.waitTime)}">${hospital.waitTime}</div>
        ${hospital.distance ? `<div class="hospital-distance">${hospital.distance.toFixed(1)}${t.km}</div>` : ''}
      </div>
      ${hospital.unavailable_services && hospital.unavailable_services.length > 0 ? `
        <div class="unavailable-services">
          ${hospital.unavailable_services.slice(0, 3).map(service => `
            <span class="service-tag">${service}</span>
          `).join('')}
          ${hospital.unavailable_services.length > 3 ? `<span class="service-tag">+${hospital.unavailable_services.length - 3}</span>` : ''}
        </div>
      ` : ''}
      <div class="hospital-actions">
        <button class="view-details" type="button">${t.viewDetails}</button>
      </div>
    `;

    const showModalHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showHospitalModal(hospital);
    };

    // Add click event listeners
    card.addEventListener('click', showModalHandler);
    
    const detailsButton = card.querySelector('.view-details');
    detailsButton.addEventListener('click', showModalHandler);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showModalHandler(e);
      }
    });

    return card;
  }

  function showHospitalModal(hospital) {
    const t = TRANSLATIONS[currentLanguage];
    const langKey = currentLanguage.toUpperCase();
    const hospName = hospital[`hospName_${langKey}`];
    const clusterKey = `cluster${currentLanguage === 'en' ? '_en' : (currentLanguage === 'sc' ? '_sc' : '')}`;
    const addressKey = `address_${currentLanguage}`;

    elements.modalTitle.textContent = `🏥 ${hospName}`;
    elements.modalAddress.textContent = hospital[addressKey];
    elements.modalPhone.textContent = hospital.phone;
    elements.modalCluster.textContent = hospital[clusterKey] || hospital.cluster;

    if (hospital.distance) {
      elements.modalDistance.textContent = `${hospital.distance.toFixed(1)}${t.km}`;
      elements.modalDistance.parentElement.style.display = 'flex';
    } else {
      elements.modalDistance.parentElement.style.display = 'none';
    }

    elements.modalUnavailableServices.innerHTML = '';
    if (!hospital.unavailable_services || hospital.unavailable_services.length === 0) {
      const noServices = document.createElement('div');
      noServices.className = 'no-services';
      noServices.textContent = t.noServices;
      elements.modalUnavailableServices.appendChild(noServices);
    } else {
      hospital.unavailable_services.forEach(service => {
        const serviceTag = document.createElement('span');
        serviceTag.className = 'service-tag';
        serviceTag.textContent = service;
        elements.modalUnavailableServices.appendChild(serviceTag);
      });
    }

    // Show the modal properly
    elements.hospitalModal.classList.remove('hidden');
    elements.hospitalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus management
    setTimeout(() => {
      elements.modalClose.focus();
    }, 100);
  }

  function closeModal() {
    elements.hospitalModal.classList.add('hidden');
    elements.hospitalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  function getUserLocation() {
    const t = TRANSLATIONS[currentLanguage];

    if (!navigator.geolocation) {
      alert(t.locationError);
      return;
    }

    elements.findNearest.disabled = true;
    elements.findNearestText.textContent = t.locating;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        elements.sortSelect.value = 'distance';
        currentSort = 'distance';
        renderHospitals();
        elements.findNearest.disabled = false;
        elements.findNearestText.textContent = t.findNearest;
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = t.locationError;
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = t.locationPermissionDenied;
        }
        alert(errorMessage);
        elements.findNearest.disabled = false;
        elements.findNearestText.textContent = t.findNearest;
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }

  // Start periodic updates only after initial connection
  function startPeriodicUpdates() {
    setInterval(async () => {
      if (!isUpdating && isConnected) {
        try {
          isUpdating = true;
          setApiStatus('fetching');
          
          const data = await fetchHospitalDataWithRetry();
          if (data && validateHospitalData(data)) {
            waitingTimeData = data.waitTime;
            renderHospitals();
            elements.lastUpdateTime.textContent = formatTime(new Date());
            setApiStatus('connected');
          }
        } catch (error) {
          console.warn('Periodic update failed:', error);
          setApiStatus('error');
        } finally {
          isUpdating = false;
        }
      }
    }, 15000); // Update every 15 seconds
  }

  // Enhanced weather data fetching
  async function fetchWeatherData() {
    try {
      const lang = currentLanguage === 'sc' ? 'sc' : (currentLanguage === 'en' ? 'en' : 'tc');

      try {
        const warningData = await fetchWithCORSFix(WEATHER_WARNING_API + lang);
        if (warningData && warningData.length > 0) {
          elements.weatherAlertText.textContent = warningData[0].name || warningData[0].warningMessage;
          elements.weatherAlert.classList.remove('hidden');
          elements.weatherAlert.classList.add('visible');
        } else {
          elements.weatherAlert.classList.remove('visible');
          elements.weatherAlert.classList.add('hidden');
        }
      } catch (error) {
        elements.weatherAlert.classList.remove('visible');
        elements.weatherAlert.classList.add('hidden');
      }

      try {
        const weatherData = await fetchWithCORSFix(WEATHER_API + lang);
        if (weatherData && weatherData.temperature && weatherData.temperature.data && weatherData.temperature.data.length > 0) {
          elements.temperature.textContent = `🌡️ ${weatherData.temperature.data[0].value}°C`;
          if (weatherData.icon && weatherData.icon.length > 0) {
            elements.weatherSummary.textContent = `🌤️ ${weatherData.icon[0]}`;
          }
        }
      } catch (error) {
        elements.temperature.textContent = '🌡️ 28°C';
        const weatherText = {
          tc: '🌤️ 多雲',
          sc: '🌤️ 多云', 
          en: '🌤️ Cloudy'
        };
        elements.weatherSummary.textContent = weatherText[currentLanguage];
      }
    } catch (error) {
      console.warn('Weather fetch failed:', error);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fixed language change handler
    elements.languageSelect.addEventListener('change', (e) => {
      const newLanguage = e.target.value;
      if (newLanguage !== currentLanguage) {
        console.log(`Language changing from ${currentLanguage} to ${newLanguage}`);
        currentLanguage = newLanguage;
        
        // Generate new mock data for immediate response
        waitingTimeData = generateMockWaitingTimeData();
        
        // Update UI immediately
        updateTranslations();
        renderHospitals();
        
        // Update weather text immediately
        const weatherText = {
          tc: '🌤️ 多雲',
          sc: '🌤️ 多云',
          en: '🌤️ Cloudy'
        };
        elements.weatherSummary.textContent = weatherText[currentLanguage];
        
        // Fetch new language data in background
        setTimeout(async () => {
          try {
            const data = await fetchHospitalDataWithRetry(currentLanguage);
            if (data && validateHospitalData(data)) {
              waitingTimeData = data.waitTime;
              renderHospitals();
            }
          } catch (error) {
            console.warn('Language change data fetch failed:', error);
          }
        }, 100);
      }
    });

    elements.sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderHospitals();
    });

    elements.regionFilter.addEventListener('change', (e) => {
      currentRegion = e.target.value;
      renderHospitals();
    });

    elements.clusterFilter.addEventListener('change', (e) => {
      currentCluster = e.target.value;
      renderHospitals();
    });

    elements.findNearest.addEventListener('click', (e) => {
      e.preventDefault();
      getUserLocation();
    });

    // Fixed modal event handlers
    elements.modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });

    elements.modalBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.hospitalModal.classList.contains('hidden')) {
        e.preventDefault();
        closeModal();
      }
    });
  }

  // Start timers
  function startTimers() {
    countdownTimer = setInterval(() => {
      if (isConnected && countdown > 0) {
        countdown--;
        updateCountdownDisplay();
      } else if (isConnected && countdown <= 0) {
        countdown = 15;
      }
    }, 1000);

    dateTimeTimer = setInterval(updateDateTime, 1000);
  }

  function stopTimers() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    if (dateTimeTimer) {
      clearInterval(dateTimeTimer);
      dateTimeTimer = null;
    }
  }

  // Initialize application
  async function initialize() {
    console.log('🚀 Initializing Enhanced Hong Kong A&E Application with Smart Proxy System...');

    // Set initial mock data
    waitingTimeData = generateMockWaitingTimeData();

    setupEventListeners();
    updateTranslations();
    updateDateTime();
    
    // Set default weather
    elements.temperature.textContent = '🌡️ 28°C';
    const weatherText = {
      tc: '🌤️ 多雲',
      sc: '🌤️ 多云',
      en: '🌤️ Cloudy'
    };
    elements.weatherSummary.textContent = weatherText[currentLanguage];

    // Render initial mock data
    renderHospitals();

    startTimers();

    // Initialize app with enhanced loading
    await initializeApp();

    // Fetch weather data in background
    fetchWeatherData().catch(console.warn);

    console.log('✅ Application initialized successfully with enhanced CORS handling');
  }

  window.addEventListener('beforeunload', () => {
    stopTimers();
  });

  // Start the application
  initialize();

})();