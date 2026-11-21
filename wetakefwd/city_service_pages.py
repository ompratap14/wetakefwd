"""Distinct nested city/service landing pages for useful local search journeys."""

CITY_CONTEXTS = {
    "Etah": {
        "slug": "etah",
        "audience": "schools, retailers, restaurants, clinics and local service teams",
        "context": "Many Etah teams manage customer communication and operations through calls, WhatsApp, paper and spreadsheets. A focused digital system can connect those steps without making the process difficult for staff or customers.",
        "example": "an Etah school or service business",
    },
    "Agra": {
        "slug": "agra",
        "audience": "hospitality, tourism, retail, education and professional-service businesses",
        "context": "Agra organisations can serve residents, visitors, partners and staff through different journeys. Clear mobile experiences and connected operations help each audience reach the right information and next step.",
        "example": "an Agra hospitality or service team",
    },
    "Aligarh": {
        "slug": "aligarh",
        "audience": "manufacturers, distributors, educational organisations and service teams",
        "context": "Aligarh organisations often coordinate customers, dealers, students, documents and approvals across several channels. The useful digital solution starts with one workflow and the people responsible for it.",
        "example": "an Aligarh manufacturer, distributor or education team",
    },
    "Mathura": {
        "slug": "mathura",
        "audience": "hospitality, visitor-focused services, education, retail and local businesses",
        "context": "Mathura businesses may need to support both local customers and visitors while keeping information, availability and follow-up current. Mobile-first journeys can reduce confusion and make personal support easier to reach.",
        "example": "a Mathura hospitality or local-service team",
    },
    "Ghaziabad": {
        "slug": "ghaziabad",
        "audience": "field-service teams, distributors, professional services and growing operations",
        "context": "Ghaziabad teams often work across customers, locations and operational handoffs. Connected websites and software can bring enquiries, tasks, documents and follow-up into a more dependable flow.",
        "example": "a Ghaziabad service or operations team",
    },
    "Noida": {
        "slug": "noida",
        "audience": "startups, B2B products, technology teams and operational businesses",
        "context": "Noida teams may be improving an existing product, launching a focused digital service or connecting internal operations. Clear product boundaries, integrations and success measures matter as much as the interface.",
        "example": "a Noida B2B or product team",
    },
}

SERVICE_PROFILES = {
    "website-development": {
        "label": "Website Development", "parent": "/web-development",
        "summary": "Fast, accessible websites that explain the offer clearly and turn visits into useful enquiries.",
        "approach": "We plan the audience, service structure, mobile journey and conversion path before development. Performance, accessibility, analytics and search foundations are included from the start.",
        "includes": ["Website strategy and information architecture", "Responsive design and development", "Local search and conversion foundations", "Analytics, launch and maintenance planning"],
        "outcome": "can replace a generic brochure site with focused service pages, faster mobile contact and an enquiry route that captures the context needed for follow-up.",
        "faq": ("Will the website work well on mobile?", "Yes. Responsive layouts, readable content, touch-friendly controls and performance on common mobile devices are part of design and testing."),
    },
    "software-development": {
        "label": "Software Development", "parent": "/custom-software-development",
        "summary": "Custom operational software shaped around users, permissions, data and real business workflows.",
        "approach": "We identify the repeated work, decisions and information that standard tools do not support well. The first release focuses on one complete workflow, with ownership, hosting, security and maintenance defined early.",
        "includes": ["Workflow and product discovery", "Dashboards, portals and internal tools", "Roles, data and approval systems", "APIs, deployment and ongoing support"],
        "outcome": "can replace disconnected spreadsheets and repeated updates with a role-based system for tasks, records, documents and reporting.",
        "faq": ("When is custom software worth building?", "It is useful when an important workflow creates repeated workarounds, errors or integration gaps that available products cannot solve economically."),
    },
    "ecommerce-development": {
        "label": "Ecommerce Development", "parent": "/services/website-app-development",
        "summary": "Mobile-first ecommerce experiences with clear products, dependable checkout and manageable operations.",
        "approach": "We define the catalogue, customer journey, payments, fulfilment, support and administration before selecting a platform or custom build. Product information and operational accuracy come before decorative features.",
        "includes": ["Store and catalogue experience design", "Payments, delivery and order workflows", "Product, inventory and administration setup", "Analytics, support and improvement planning"],
        "outcome": "can organise its catalogue, accept structured orders and keep customers informed while staff manage products and exceptions from one controlled view.",
        "faq": ("Should we use an ecommerce platform or build custom?", "We compare catalogue complexity, integrations, ownership, budget and future change before recommending a configured platform or custom development."),
    },
    "ai-automation": {
        "label": "AI Automation", "parent": "/business-automation-services",
        "summary": "Controlled AI workflows for repeated enquiries, documents, follow-up and operational handoffs.",
        "approach": "We map the trigger, approved information, allowed action, exception and responsible person before connecting AI. Sensitive or uncertain work remains visible for review.",
        "includes": ["Automation opportunity and workflow mapping", "AI classification, extraction and drafting", "CRM, inbox and document integrations", "Approvals, monitoring and human escalation"],
        "outcome": "can classify incoming requests, prepare an approved response, create the right record and alert a person when judgement is required.",
        "faq": ("Will AI automation replace our team?", "The aim is to reduce avoidable repetition and delay. People remain responsible for judgement, customer relationships and high-impact decisions."),
    },
    "business-automation": {
        "label": "Business Automation", "parent": "/business-automation-services",
        "summary": "Connected workflows that reduce repeated data entry, missed follow-up and unclear ownership.",
        "approach": "We document how work moves today, where it waits and what must stay under human control. Then we connect forms, inboxes, WhatsApp, CRM or internal tools around a measurable first outcome.",
        "includes": ["Process mapping and prioritisation", "Forms, CRM and communication workflows", "Assignments, reminders and approvals", "Reporting, documentation and support"],
        "outcome": "can capture an enquiry, assign ownership, acknowledge the customer and schedule follow-up without copying the same information between tools.",
        "faq": ("What should we automate first?", "Start with a frequent, predictable process where delay or repetition has a measurable cost and exceptions can be handled by a named person."),
    },
    "school-website-development": {
        "label": "School Website Development", "parent": "/web-development",
        "summary": "Clear, mobile-friendly school websites for admissions, notices, trust and parent communication.",
        "approach": "We organise the site around prospective families, current parents, students and staff. Admissions information, policies, notices and contact routes stay easy to find and manageable by approved school users.",
        "includes": ["Admissions and parent journey planning", "Mobile-friendly school website design", "Notices, forms and content administration", "Performance, accessibility and search setup"],
        "outcome": "can give families one reliable place for admissions, notices and contact while staff update approved information without depending on scattered chat messages.",
        "faq": ("Can school staff update notices and pages?", "Yes. We can provide a controlled administration area and define which staff roles may update each type of content."),
    },
    "restaurant-website-development": {
        "label": "Restaurant Website Development", "parent": "/web-development",
        "summary": "Fast restaurant websites for menus, discovery, reservations, events and direct customer contact.",
        "approach": "We design for the mobile decisions customers make quickly: view the menu, confirm location and hours, reserve, order or ask a question. Information must stay accurate and easy for the restaurant team to update.",
        "includes": ["Mobile menu and restaurant experience", "Reservations, ordering and enquiry paths", "Maps, local discovery and analytics", "Content updates and ongoing support"],
        "outcome": "can turn local and visitor searches into menu views, reservations or direct enquiries while keeping special requests connected to a person.",
        "faq": ("Can the website support reservations or online ordering?", "Yes. We can connect suitable booking, ordering or payment tools after confirming availability, fees, workflow and support responsibilities."),
    },
    "custom-crm-development": {
        "label": "Custom CRM Development", "parent": "/custom-software-development",
        "summary": "A focused CRM shaped around the enquiries, pipeline, follow-up and reporting the team actually uses.",
        "approach": "We define the customer stages, required information, ownership and reporting before building. A custom CRM should remove workarounds without recreating features the team will never use.",
        "includes": ["Pipeline and data-model discovery", "Lead capture, assignment and follow-up", "Roles, permissions and dashboards", "Email, WhatsApp and system integrations"],
        "outcome": "can bring website and WhatsApp enquiries into one pipeline, assign the right owner and make overdue follow-up visible.",
        "faq": ("Should we customise an existing CRM or build one?", "We compare established products, configuration, integration needs and long-term ownership before recommending a custom build."),
    },
    "custom-software-development": {
        "label": "Custom Software Development", "parent": "/custom-software-development",
        "summary": "Purpose-built portals, dashboards and operational systems for workflows generic products cannot support well.",
        "approach": "We begin with users, roles, data and the smallest complete workflow. Architecture, security, integrations, deployment and support are planned as product responsibilities rather than left until launch.",
        "includes": ["Product and workflow discovery", "Portals, dashboards and internal systems", "APIs, data and third-party integrations", "Testing, deployment and maintenance"],
        "outcome": "can launch a controlled operations portal that connects customer records, tasks, documents and reporting around the way its team works.",
        "faq": ("Who owns the custom software?", "Code, hosting, access, data, documentation and support responsibilities are agreed clearly in the proposal before development starts."),
    },
}

ROUTE_SPECS = [
    *( ("website-development", city) for city in ("Etah", "Agra", "Aligarh", "Mathura") ),
    *( ("software-development", city) for city in ("Etah", "Agra", "Aligarh", "Mathura") ),
    *( ("ecommerce-development", city) for city in ("Etah", "Agra", "Aligarh", "Mathura") ),
    *( ("ai-automation", city) for city in ("Etah", "Agra", "Aligarh", "Noida") ),
    *( ("business-automation", city) for city in ("Etah", "Agra") ),
    *( ("school-website-development", city) for city in ("Etah", "Agra") ),
    *( ("restaurant-website-development", city) for city in ("Etah", "Agra") ),
    ("custom-crm-development", "Agra"),
    ("custom-software-development", "Noida"),
]


def build_page(service_slug, city_name):
    service = SERVICE_PROFILES[service_slug]
    city = CITY_CONTEXTS[city_name]
    title = f"{service['label']} in {city_name}"
    path = f"/{service_slug}/{city['slug']}"
    return dict(
        slug=f"{service_slug}-{city['slug']}", path=path, location=city_name,
        primary_keyword=title, title=title, short_title=f"{city_name} {service['label'].lower()}",
        category=f"{city_name.upper()} / {service['label'].upper()}",
        summary=f"{service['summary']} Built for {city['audience']} in {city_name}.",
        intro=f"{city['context']} {service['summary']}",
        detail=f"{service['approach']} Delivery can be remote or include an agreed local requirement; WeTakeFWD does not claim a physical office in {city_name} unless one is established and verified.",
        includes=service["includes"],
        use_case=f"For example, {city['example']} {service['outcome']}",
        meta_title=f"{title} | WeTakeFWD",
        meta_description=f"{service['label'].lower()} in {city_name} for {city['audience']}, with practical discovery, design, integrations and support.",
        faq=[
            (f"What does {service['label'].lower()} in {city_name} include?", f"The scope can include {', '.join(item.lower() for item in service['includes'][:3])}. We confirm the first useful release after reviewing the users, workflow and current tools."),
            service["faq"],
            (f"Does WeTakeFWD have to be physically based in {city_name}?", f"No. We can deliver remotely for organisations in {city_name}. Any on-site work, service area or local presence is described accurately and agreed before the project begins."),
        ],
        parent_path=service["parent"],
    )


NESTED_CITY_SERVICE_PAGES = [build_page(service, city) for service, city in ROUTE_SPECS]
