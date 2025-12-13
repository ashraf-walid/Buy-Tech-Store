    // Static JavaScript Module
    
    // Field definitions
    export const fieldsBasic = [
        { label: "Name", path: "name", type: "text", required: true, placeholder: "Name", colSpan: 1 },
        { label: "Brand", path: "brand", type: "text", required: true, placeholder: "Brand (e.g., Dell)", colSpan: 1 },
        { label: "Model", path: "model", type: "text", placeholder: "Model (e.g., Latitude 5430)" },
        { label: "Category", path: "category", type: "select",
            options: [
                { label: "Laptop", value: "laptop" },
                { label: "Desktop", value: "desktop" },
                { label: "Monitor", value: "monitor" },
                { label: "Accessory", value: "accessory" },
                { label: "Printer", value: "printer" },
                { label: "Tablet", value: "tablet" },
                { label: "Networking", value: "networking" },
                { label: "Components", value: "components" },
            ],
            placeholder: "Select Category",
            required: true,
        },
        { label: "Sub Category", path: "subCategory", type: "select", dynamic: true, placeholder: "Select Sub Category (optional)", },
        { label: "Badge", path: "badge", type: "text", placeholder: "Badge (e.g., featured, trending)" },
        { label: "Release Year", path: "releaseYear", type: "number", placeholder: "Release Year" },
        { label: "Description", path: "description", type: "textarea", placeholder: "Description", colSpan: 3 },
    ];

    export const fieldsMedia = [
        { label: "Tags", path: "tags", type: "multiselect",
            options: [
              { label: "New", value: "new" },
              { label: "Featured", value: "featured" },
              { label: "Trending", value: "trending" },
              { label: "Bestseller", value: "bestseller" },
              { label: "Exclusive", value: "exclusive" },
            ],
            placeholder: "Select product tags",
            colSpan: 2,
          },
        { label: "Extra Features", path: "extraFeatures", type: "tags", placeholder: "Add product features (press Enter to add)", colSpan: 2 },
    ];

    export const fieldsPricing = [
        { label: "Price", path: "price", type: "number", placeholder: "Price", required: true, inputProps: { min: 0, step: 1 } },
        { label: "Discount %", path: "discount", type: "number", placeholder: "Discount %", inputProps: { min: 0, max: 100, step: 1 } },
        { label: "Stock", path: "stock", type: "number", placeholder: "Stock (leave blank for null)", inputProps: { min: 0, step: 1 } },
        { label: "Warranty", path: "warranty", type: "text", placeholder: "warranty 1 year" },
        { label: "Condition", path: "condition", type: "text", placeholder: "جديد / استيراد", colSpan: 2 },
    ];

    export const fieldsSpecs = [
        { label: "CPU Brand", path: "specs.cpu.brand", type: "text", placeholder: "CPU Brand Intel" },
        { label: "CPU Model", path: "specs.cpu.model", type: "text", placeholder: "CPU Model Core i7-1255U" },
        { label: "CPU Generation", path: "specs.cpu.generation", type: "number", placeholder: "CPU Generation 12" },
        { label: "Base Clock (GHz)", path: "specs.cpu.baseClock", type: "number", placeholder: "Base Clock 1.7 (GHz)", inputProps: { step: 1 } },
        { label: "Boost Clock (GHz)", path: "specs.cpu.boostClock", type: "number", placeholder: "Boost Clock 4.7 (GHz)", inputProps: { step: 1 } },
        { label: "Cores", path: "specs.cpu.cores", type: "number", placeholder: "Cores 10" },
        { label: "Threads", path: "specs.cpu.threads", type: "number", placeholder: "Threads 12" },

        { label: "GPU Brand", path: "specs.gpu.brand", type: "text", placeholder: "GPU Brand Intel" },
        { label: "GPU Model", path: "specs.gpu.model", type: "text", placeholder: "GPU Model Iris Xe" },
        { label: "Dedicated GPU", path: "specs.gpu.dedicated", type: "checkbox", placeholder: "Dedicated GPU true / false" },

        { label: "RAM Size", path: "specs.ram.size", type: "number", placeholder: "RAM Size" },
        { label: "RAM Type", path: "specs.ram.type", type: "text", placeholder: "RAM Type" },
        { label: "RAM Speed (MHz)", path: "specs.ram.speed", type: "number", placeholder: "RAM Speed (MHz)" },

        { label: "Storage Capacity", path: "specs.storage.capacity", type: "number", placeholder: "Storage Capacity" },
        { label: "Storage Type", path: "specs.storage.type", type: "text", placeholder: "Storage Type (e.g., SSD/HDD)" },
        { label: "Storage Interface", path: "specs.storage.interface", type: "text", placeholder: "Storage Interface (e.g., NVMe)" },

        { label: "Screen Size (inch)", path: "specs.screen.size", type: "number", placeholder: "Screen Size (inch)", inputProps: { step: 1 } },
        { label: "Screen Resolution", path: "specs.screen.resolution", type: "text", placeholder: "Screen Resolution" },
        { label: "Refresh Rate (Hz)", path: "specs.screen.refreshRate", type: "number", placeholder: "Refresh Rate (Hz)" },
        { label: "Anti-Glare", path: "specs.screen.antiGlare", type: "checkbox", placeholder: "Anti-Glare" },

        { label: "Battery Capacity (Wh)", path: "specs.battery.capacity", type: "number", placeholder: "Battery Capacity (Wh)" },
        { label: "Battery Cells", path: "specs.battery.cells", type: "number", placeholder: "Battery Cells" },

        { label: "Operating System", path: "specs.OperatingSystem", type: "text", placeholder: "Operating System", colSpan: 3 },
        { label: "Ports", path: "specs.ports", type: "tags", placeholder: "Add available ports (press Enter to add)", colSpan: 3 },
        { label: "Connectivity", path: "specs.connectivity", type: "tags", placeholder: "Add available Connectivity (press Enter to add)", colSpan: 3 },

        { label: "Weight (kg)", path: "specs.weight", type: "number", placeholder: "Weight (kg)", inputProps: { step: 1 } },

        { label: "Keyboard Language", path: "specs.keyboardLanguage", type: "text", placeholder: "Keyboard Language" },
        { label: "Body Material", path: "specs.bodyMaterial", type: "text", placeholder: "Body Material" },
        { label: "Color", path: "specs.color", type: "text", placeholder: "Color" },

        { label: "Max Memory (GB)", path: "specs.maxMemory", type: "number", placeholder: "Max Memory (GB)" },
        { label: "Camera", path: "specs.camera", type: "text", placeholder: "Camera" },
        { label: "Audio", path: "specs.audio", type: "text", placeholder: "Audio" },
    ];