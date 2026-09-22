async function loadProjects() {
    const { data: projects, error } = await window.supabaseClient
        .from("projects")
        .select("*")
        .order("display_order");

    if (error) {
        console.error(error);
        return;
    }

    renderProjects(projects);
}

function renderProjects(projects) {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("article");

        card.className = "project-card glass-card reveal";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-selected", "false");
        card.setAttribute("aria-label", `View ${project.title}`);

        card.dataset.title = project.title;
        card.dataset.category = project.category || "";
        card.dataset.year = project.year || "";
        card.dataset.description = project.description || "";
        card.dataset.tech = (project.tech_stack || []).join(",");
        card.dataset.image = project.image_url || "";
        card.dataset.github = project.github_link || "";
        card.dataset.demo = project.live_link || "";

        card.innerHTML = `
            <div class="project-card-img-wrap">
                <img
                    src="${project.image_url || ""}"
                    class="project-card-img"
                    alt="${project.title}"
                    loading="lazy">
            </div>

            <div class="project-card-body">
                <div class="project-card-meta">
                    <span class="project-card-year">${project.year || ""}</span>
                    <span class="project-card-category">${project.category || ""}</span>
                </div>

                <h3 class="project-card-title">
                    ${project.title}
                </h3>

                <div class="project-card-tech">
                    ${(project.tech_stack || [])
                        .slice(0,3)
                        .map(t => `<span>${t}</span>`)
                        .join("")}
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    document.getElementById("projects-count").textContent = 
        `${projects.length.toString().padStart(2, "0")} cases`;

    initPreviewPanel();
    
    // Trigger entrance animations for the dynamically added cards
    if (typeof initScrollReveals === 'function') {
        initScrollReveals();
    }
}