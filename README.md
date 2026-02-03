# 1️⃣ COMPONENT 1 — **Core Skills Wave**

### Purpose

Represent your **coreCapabilities** as **primary skill planets** connected by a **wave-style path**, showing confidence and structure.

---

## 📦 Data Source (fixed)

```js
skillsData.coreCapabilities;
```

Each item contains:

- id
- name
- confidence (high / medium)
- role
- summary
- usage[]
- ecosystem[]
- icon

---

## 🧠 Mental Model

> Core skills are **stable planets** aligned on a wave path
> They don’t move randomly — they show **confidence and clarity**

---

## 🧩 Core Skills Wave — Code Generation Prompt

> Build a **CoreSkillsWave** React component using the following rules:
>
> ### Layout
>
> - Render skills horizontally as **planet-style circular nodes**
> - Nodes are aligned along a **single smooth SVG wave path**
> - The wave path runs left → right behind the planets
> - Layout adapts based on screen width:
>   - Desktop: single horizontal wave
>   - Tablet: slightly compressed wave
>   - Mobile: stacked wave segments (still curved, not straight)
>
> ### Visual Style
>
> - Each skill is a **planet node** with:
>   - Circular shape
>   - Skill icon centered
>   - Soft glow
> - Planet size depends on `confidence`:
>   - high → larger + stronger glow
>   - medium → slightly smaller + softer glow
>
> ### Interaction
>
> - On hover (desktop) or tap (mobile):
>   - Highlight the selected planet
>   - Brighten the wave path near that planet
>   - Trigger a callback with full skill data
>
> ### Data Handling
>
> - Use `skillsData.coreCapabilities`
> - Do NOT hardcode skill names or count
> - Component must work if skills are added or removed
>
> ### Constraints
>
> - No orbit rotation
> - No random motion
> - No overlapping nodes
> - Motion should be minimal and intentional
>
> ### Output
>
> - Component exposes `onSelect(skill)` for showing details outside the component
> - Component contains only visual + interaction logic

---

# 2️⃣ COMPONENT 2 — **Supporting Skills Wave**

### Purpose

Represent **supportingStack** as **secondary planets** that visually support the core skills.

---

## 📦 Data Source (fixed)

```js
skillsData.supportingStack;
```

Array of strings:

- "MongoDB"
- "SQL"
- "Git"
- "GitHub"
- etc.

---

## 🧠 Mental Model

> Supporting skills are **tools orbiting the system**,
> but visually they stay **below and connected**, not floating freely.

---

## 🧩 Supporting Skills Wave — Code Generation Prompt

> Build a **SupportingSkillsWave** React component with the following behavior:
>
> ### Layout
>
> - Render supporting skills as **smaller planet nodes**
> - Arrange them in one or two horizontal rows
> - Place this component **below CoreSkillsWave**
> - Connect planets using a **lighter, secondary SVG wave path**
>
> ### Visual Style
>
> - Planets are:
>   - Smaller than core skill planets
>   - Lower glow intensity
>   - Subtle border
> - Wave path is:
>   - Thinner than core wave
>   - Lower opacity
>
> ### Interaction
>
> - On hover / tap:
>   - Highlight the selected supporting skill
>   - Slightly brighten the wave path
>   - Show minimal tooltip or pass selection upward
>
> ### Data Handling
>
> - Convert each string in `skillsData.supportingStack` into a planet node
> - No assumptions about total count
> - Automatically wrap into multiple rows if needed
>
> ### Constraints
>
> - No animations that distract
> - No orbit logic
> - No random movement
> - Must align visually with CoreSkillsWave
>
> ### Output
>
> - Component exposes `onSelect(name)`
> - Works independently of core skills
> - Can be reused or reordered without breaking layout
