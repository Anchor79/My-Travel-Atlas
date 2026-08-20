// ==========================================
// My Travel Atlas
// 动态生成徒步路线目录
// ==========================================


// 读取徒步路线数据
async function loadTrails() {

    try {

        const response = await fetch("data/trails.json");

        const data = await response.json();

        return data.trails;

    } catch (error) {

        console.error("无法读取徒步路线数据：", error);

        return [];

    }

}



// ==========================================
// 根据路线数据建立树状目录
// ==========================================

function buildNavigation(trails) {


    // 按照：
    // 国家 → 省份 → 区域 → 路线
    // 建立层级结构

    const tree = {};


    trails.forEach(trail => {


        const country = trail.country;

        const province = trail.province;

        const region = trail.region;


        // 国家
        if (!tree[country]) {

            tree[country] = {};

        }


        // 省份
        if (!tree[country][province]) {

            tree[country][province] = {};

        }


        // 区域
        if (!tree[country][province][region]) {

            tree[country][province][region] = [];

        }


        // 徒步路线
        tree[country][province][region].push(trail);

    });


    return tree;

}



// ==========================================
// 创建一个可以展开/收起的目录节点
// ==========================================

function createFolder(title, children, level = 0) {


    const container = document.createElement("div");

    container.className = "nav-folder";


    // 标题
    const titleElement = document.createElement("div");

    titleElement.className = "nav-folder-title";

    titleElement.innerHTML = `
        <span class="arrow">▶</span>
        <span>${title}</span>
    `;


    // 子内容
    const childrenElement = document.createElement("div");

    childrenElement.className = "nav-folder-children";

    childrenElement.style.display = "none";


    // 点击展开 / 收起
    titleElement.addEventListener("click", () => {


        const isOpen =
            childrenElement.style.display === "block";


        if (isOpen) {

            childrenElement.style.display = "none";

            titleElement.querySelector(".arrow").textContent = "▶";

        } else {

            childrenElement.style.display = "block";

            titleElement.querySelector(".arrow").textContent = "▼";

        }

    });


    container.appendChild(titleElement);

    container.appendChild(childrenElement);


    return {
        container,
        childrenElement
    };

}



// ==========================================
// 创建路线
// ==========================================

function createTrail(trail) {


    const element = document.createElement("div");


    element.className = "nav-trail";


    element.textContent = "• " + trail.name;


    element.addEventListener("click", () => {

        console.log("打开徒步路线：", trail.id);

    });


    return element;

}



// ==========================================
// 渲染整个目录
// ==========================================

function renderNavigation(trails) {


    const sidebar = document.querySelector(".sidebar");


    if (!sidebar) {

        console.error("找不到 sidebar");

        return;

    }


    // 保留 EXPLORE 标题
    sidebar.innerHTML = `
        <div class="sidebar-title">
            EXPLORE
        </div>
    `;


    // 建立树
    const tree = buildNavigation(trails);


    // 中国
    Object.keys(tree).forEach(country => {


        const countryFolder =
            createFolder(country, null);


        sidebar.appendChild(countryFolder.container);


        const provinces =
            tree[country];


        // 省份
        Object.keys(provinces).forEach(province => {


            const provinceFolder =
                createFolder(province, null);


            countryFolder.childrenElement
                .appendChild(provinceFolder.container);


            const regions =
                provinces[province];


            // 区域
            Object.keys(regions).forEach(region => {


                const regionFolder =
                    createFolder(region, null);


                provinceFolder.childrenElement
                    .appendChild(regionFolder.container);


                const trailsInRegion =
                    regions[region];


                // 徒步路线
                trailsInRegion.forEach(trail => {


                    const trailElement =
                        createTrail(trail);


                    regionFolder.childrenElement
                        .appendChild(trailElement);

                });

            });

        });

    });

}



// ==========================================
// 初始化
// ==========================================

async function init() {


    const trails =
        await loadTrails();


    renderNavigation(trails);


}


init();
