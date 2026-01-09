import { LearningModule, LearningPathData } from '../types';

// Predefined 12-module syllabus for Beginners
const beginnerSyllabus: LearningModule[] = [
  {
    module_title: "Module 1: Basic Vowels",
    module_description: "Learn the 10 basic Korean vowels, the building blocks of Hangul.",
    steps: [
      { type: 'hangul_vowel', topic: "Basic Vowels", title: "The 10 Basic Vowels (ㅏ, ㅑ, ㅓ, ㅕ, ㅗ, ㅛ, ㅜ, ㅠ, ㅡ, ㅣ): 기본 모음", level: 'Beginner' },
      { type: 'vocabulary', topic: "Vowel Words", title: "Simple Vowel Words: 모음 단어", level: 'Beginner' },
      { type: 'reading_practice', topic: "Vowel-Only Words", title: "Reading Practice: Vowel-Only Words (모음만 있는 단어 읽기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 2: Diphthongs (Combined Vowels)",
    module_description: "Master the 11 combined vowels to expand your reading ability.",
    steps: [
      { type: 'hangul_vowel', topic: "Combined Vowels", title: "The 11 Diphthongs (ㅐ, ㅒ, ㅔ, ㅖ, ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ): 이중 모음", level: 'Beginner' },
      { type: 'vocabulary', topic: "Diphthong Words", title: "Vocabulary with Diphthongs: 이중 모음 단어", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 3: Basic & Aspirated Consonants",
    module_description: "Learn the Korean consonants to start forming syllables.",
    steps: [
      { type: 'hangul_consonant', topic: "Basic Consonants", title: "The 14 Basic & Aspirated Consonants (ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ): 기본 및 격음 자음", level: 'Beginner' },
      { type: 'reading_practice', topic: "Syllable Reading", title: "Reading Practice: C+V Syllables (자음+모음 음절 읽기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 4: Tense Consonants & Syllable Building",
    module_description: "Understand tense consonants and how to combine characters into syllable blocks.",
    steps: [
      { type: 'hangul_consonant', topic: "Tense Consonants", title: "The 5 Tense Consonants (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ): 경음 자음", level: 'Beginner' },
      { type: 'grammar', topic: "Syllable Structure", title: "Syllable Structure: CV & CVC (음절 구조)", level: 'Beginner' },
      { type: 'vocabulary', topic: "All Characters Vocabulary", title: "Vocabulary: All Learned Characters (배운 모든 글자 단어)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 5: Final Consonants (Batchim) & Pronunciation Rules 1",
    module_description: "Understand single final consonants, how they link to vowels, and how they change other sounds.",
    steps: [
      { type: 'hangul_batchim', topic: "Batchim Introduction", title: "Intro to Batchim & 7 Sounds: 받침 소개 및 7개 대표음", level: 'Beginner' },
      { type: 'pronunciation_rule', topic: "Liaison (연음)", title: "Pronunciation Rule: Liaison (연음)", level: 'Beginner' },
      { type: 'pronunciation_rule', topic: "Nasalization (비음화)", title: "Pronunciation Rule: Nasalization (비음화)", level: 'Beginner' },
      { type: 'vocabulary', topic: "Batchim Vocabulary", title: "Batchim Vocabulary & Practice: 받침 단어와 발음 연습", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 6: Double Batchim & Advanced Pronunciation",
    module_description: "Master double final consonants and more complex sound change rules.",
    steps: [
      { type: 'hangul_batchim', topic: "Double Batchim Introduction", title: "Introduction to Double Batchim (겹받침)", level: 'Beginner' },
      { type: 'pronunciation_rule', topic: "Tensing (경음화)", title: "Pronunciation Rule: Tensing (경음화)", level: 'Beginner' },
      { type: 'pronunciation_rule', topic: "Aspiration (격음화)", title: "Pronunciation Rule: Aspiration (격음화)", level: 'Beginner' },
      { type: 'pronunciation_rule', topic: "Palatalization (구개음화)", title: "Pronunciation Rule: Palatalization (구개음화)", level: 'Beginner' },
      { type: 'reading_practice', topic: "Double Batchim Reading", title: "Reading: Double Batchim in Context (겹받침 문맥에서 읽기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 7: Greetings & 'To Be'",
    module_description: "Learn essential phrases for everyday interactions and the 'to be' verb.",
    steps: [
      { type: 'grammar', topic: "Formal 'To Be'", title: "Grammar: Formal 'To Be': 입니다/입니까", level: 'Beginner' },
      { type: 'grammar', topic: "Informal Polite 'To Be'", title: "Grammar: Informal Polite 'To Be': 이에요/예요", level: 'Beginner' },
      { type: 'vocabulary', topic: "Greetings", title: "Vocabulary: Greetings & Classroom Phrases (인사 및 교실 표현)", level: 'Beginner' },
      { type: 'dialogue', topic: "Introductions", title: "Dialogue: Introductions (소개)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 8: Particles 1 (Topic & Subject)",
    module_description: "Grasp the fundamental topic and subject marking particles.",
    steps: [
      { type: 'grammar', topic: "Subject Particles", title: "Grammar: Subject Particles: 이/가", level: 'Beginner' },
      { type: 'grammar', topic: "Topic Particles", title: "Grammar: Topic Particles: 은/는", level: 'Beginner' },
      { type: 'grammar', topic: "Particle Comparison", title: "Grammar: Comparing Particles: 이/가 vs 은/는 비교", level: 'Beginner' },
      { type: 'dialogue', topic: "Introducing with Particles", title: "Dialogue: Introducing with Particles (조사로 소개하기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 9: Particles 2 (Object & Location)",
    module_description: "Learn how to mark objects and talk about locations.",
    steps: [
      { type: 'grammar', topic: "Object Particles", title: "Grammar: Object Particles: 을/를", level: 'Beginner' },
      { type: 'grammar', topic: "Location & Time Particle", title: "Grammar: Location & Time Particle: 에", level: 'Beginner' },
      { type: 'grammar', topic: "Action Location Particle", title: "Grammar: Action Location Particle: 에서", level: 'Beginner' },
      { type: 'vocabulary', topic: "Places", title: "Vocabulary: Places in a City (도시의 장소)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 10: Numbers & Time",
    module_description: "Learn how to count and talk about time and dates in Korean.",
    steps: [
      { type: 'vocabulary', topic: "Sino-Korean Numbers", title: "Vocabulary: Sino-Korean Numbers: 한자어 수", level: 'Beginner' },
      { type: 'vocabulary', topic: "Native Korean Numbers", title: "Vocabulary: Native Korean Numbers: 고유어 수", level: 'Beginner' },
      { type: 'grammar', topic: "Telling Time", title: "Grammar: Telling Time (시/분)", level: 'Beginner' },
      { type: 'dialogue', topic: "Appointments", title: "Dialogue: Making an Appointment (약속 잡기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 11: Verbs, Present Tense & Existence",
    module_description: "Learn how to describe actions and existence using the informal polite present tense.",
    steps: [
      { type: 'grammar', topic: "Present Tense", title: "Grammar: Present Tense: -아요/어요/해요", level: 'Beginner' },
      { type: 'vocabulary', topic: "Common Verbs", title: "Vocabulary: 10 Common Verbs (자주 쓰는 동사 10개)", level: 'Beginner' },
      { type: 'grammar', topic: "Existence & Possession", title: "Grammar: Existence & Possession: 있어요/없어요", level: 'Beginner' },
      { type: 'reading_practice', topic: "Daily Routine", title: "Reading: A Daily Routine (하루 일과 읽기)", level: 'Beginner' }
    ]
  },
  {
    module_title: "Module 12: Past/Future Tenses & Negation",
    module_description: "Learn to talk about past events, future plans, and how to make negative sentences.",
    steps: [
      { type: 'grammar', topic: "Past Tense", title: "Grammar: Past Tense: -았/었/했어요", level: 'Beginner' },
      { type: 'grammar', topic: "Future Tense", title: "Grammar: Future Tense: -(으)ㄹ 거예요", level: 'Beginner' },
      { type: 'grammar', topic: "Negation", title: "Grammar: Negation: 안 / -지 않다", level: 'Beginner' },
      { type: 'grammar', topic: "Inability", title: "Grammar: Inability: 못", level: 'Beginner' },
      { type: 'dialogue', topic: "Weekend Plans", title: "Dialogue: Weekend Plans (주말 계획)", level: 'Beginner' }
    ]
  }
];

// Predefined 12-module syllabus for Intermediate
const intermediateSyllabus: LearningModule[] = [
    {
        module_title: "Module 1: Expressing Reasons, Causes & Results",
        module_description: "Learn various ways to explain reasons and consequences for more nuanced conversations.",
        steps: [
            { type: 'grammar', topic: 'Comparing Reasons', title: 'Grammar: Comparing Reasons: -아/어서 vs -(으)니까', level: 'Intermediate' },
            { type: 'grammar', topic: 'Negative Reasons', title: 'Grammar: Negative Reasons: -(으)ㄴ/는 탓에 & -는 바람에', level: 'Intermediate' },
            { type: 'grammar', topic: 'Positive Reasons', title: 'Grammar: Positive Reasons: -는 덕분에', level: 'Intermediate' },
            { type: 'grammar', topic: 'Reason with Trade-off', title: 'Grammar: Reason with Trade-off: -느라고', level: 'Intermediate' },
            { type: 'grammar', topic: 'Reason from Observation', title: 'Grammar: Reason from Observation: -(으)ㄴ/는 걸 보니(까)', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Feelings and Excuses', title: 'Vocabulary: Feelings and Excuses (감정과 변명)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Explaining Lateness', title: 'Dialogue: Explaining Lateness (지각 이유 설명하기)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 2: Plans, Intentions & Purpose",
        module_description: "Master grammar for making suggestions, stating your intentions, and explaining your purpose.",
        steps: [
            { type: 'grammar', topic: 'Suggestions', title: 'Grammar: Suggestions: -(으)ㄹ까요? & -(으)ㅂ시다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Intention/Preference', title: 'Grammar: Intention/Preference: -(으)ㄹ래요?', level: 'Intermediate' },
            { type: 'grammar', topic: 'Purpose', title: 'Grammar: Purpose: -기 위해(서) & -(으)려면', level: 'Intermediate' },
            { type: 'grammar', topic: 'Intended Reason', title: 'Grammar: Intended Reason: -(으)ㄹ 테니(까)', level: 'Intermediate' },
            { type: 'grammar', topic: 'Worthwhile Action', title: 'Grammar: Worthwhile Action: -(으)ㄹ 만하다', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Hobbies and Activities', title: 'Vocabulary: Hobbies and Plans (취미와 미래 계획)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Trip Planning', title: 'Dialogue: Trip Planning (주말 여행 계획하기)', level: 'Intermediate' },
            { type: 'reading_practice', topic: "New Year's Resolutions", title: "Reading: New Year's Resolutions (새해 다짐에 대한 블로그 글)", level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 3: Connecting & Contrasting Ideas",
        module_description: "Connect ideas smoothly by providing background, listing information, or contrasting two points.",
        steps: [
            { type: 'grammar', topic: 'Background Info', title: 'Grammar: Background Info: -는데/-(으)ㄴ데', level: 'Intermediate' },
            { type: 'grammar', topic: 'Contrast', title: 'Grammar: Contrast: -지만 vs -(으)ㄴ/는 반면에', level: 'Intermediate' },
            { type: 'grammar', topic: 'Acknowledging & Contrasting', title: 'Grammar: Acknowledging & Contrasting: -기는 하지만', level: 'Intermediate' },
            { type: 'grammar', topic: 'Adding Information', title: 'Grammar: Adding Information: -(으)ㄹ 뿐만 아니라', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'City vs Country', title: 'Vocabulary: City vs Country (도시 생활 vs 시골 생활)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Pros and Cons', title: 'Dialogue: Pros and Cons of City Life (도시 생활의 장단점 토론)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 4: Reported Speech (Indirect Quotations)",
        module_description: "Learn how to report what other people have said, asked, or suggested.",
        steps: [
            { type: 'grammar', topic: 'Reported Statements', title: 'Grammar: Reported Speech (Statements): -다고 하다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Reported Questions', title: 'Grammar: Reported Speech (Questions): -냐고 하다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Reported Suggestions', title: 'Grammar: Reported Speech (Suggestions): -자고 하다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Reported Commands', title: 'Grammar: Reported Speech (Commands): -(으)라고 하다', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Communication Verbs', title: 'Vocabulary: Communication Verbs (전하다, 묻다, 답하다)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Relaying Messages', title: 'Dialogue: Relaying a Message (메시지 전달하기)', level: 'Intermediate' },
            { type: 'reading_practice', topic: 'A news report quoting a witness', title: 'Reading: News Report (목격자를 인용한 짧은 뉴스 기사)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 5: Ability, Obligation & Rules",
        module_description: "Talk about what you can, must, cannot, and have no choice but to do.",
        steps: [
            { type: 'grammar', topic: 'Ability', title: 'Grammar: Ability: -(으)ㄹ 수 있다/없다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Obligation', title: 'Grammar: Obligation: -아야/어야 하다/되다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Prohibition', title: 'Grammar: Prohibition: -(으)면 안 되다', level: 'Intermediate' },
            { type: 'grammar', topic: 'No Other Choice', title: 'Grammar: No Other Choice: -(으)ㄹ 수밖에 없다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Suggestion to Try', title: 'Grammar: Suggestion to Try: -하도록 하다', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Public Places', title: 'Vocabulary: Public Places & Rules (공공장소와 규칙)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Library Rules', title: 'Dialogue: Library Rules (도서관 규칙 묻기)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 6: Sequencing Actions & Describing States",
        module_description: "Learn to describe the order of actions and states that are maintained.",
        steps: [
            { type: 'grammar', topic: 'Sequencing Actions', title: 'Grammar: Sequencing Actions: -고 나서 vs -자마자', level: 'Intermediate' },
            { type: 'grammar', topic: 'Action in a State', title: 'Grammar: Action in a State: -(으)ㄴ 채(로)', level: 'Intermediate' },
            { type: 'grammar', topic: 'On the Way', title: 'Grammar: On the Way: -는 길에', level: 'Intermediate' },
            { type: 'grammar', topic: 'Nominalization', title: 'Grammar: Nominalization: -는 것', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Office Terms', title: 'Vocabulary: Office and Job-related Terms (회사, 직업, 회의, 보고서)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Work Task', title: 'Dialogue: Talking about a work task (업무에 대해 동료와 대화하기)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 7: Expressing Degree & Proportion",
        module_description: "Learn how to explain data, trends, and talk about things changing in proportion.",
        steps: [
            { type: 'grammar', topic: 'The More...', title: 'Grammar: The More...: -(으)ㄹ수록', level: 'Intermediate' },
            { type: 'grammar', topic: 'To the Extent That...', title: 'Grammar: To the Extent That...: -(으)ㄹ 정도(로)', level: 'Intermediate' },
            { type: 'grammar', topic: 'As Much As', title: 'Grammar: As Much As: -(으)ㄴ/는 만큼', level: 'Intermediate' },
            { type: 'grammar', topic: 'According To', title: 'Grammar: According To: -에 따르면', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Graph Terminology', title: 'Vocabulary: Graph & Chart Terminology (증가하다, 감소하다, 비율)', level: 'Intermediate' },
            { type: 'reading_practice', topic: 'Smartphone usage graph', title: "Reading a Graph: Smartphone Usage (연령대별 스마트폰 사용량 변화 그래프 읽기)", level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 8: Passive & Causative Verbs",
        module_description: "Understand the difference between doing an action, having it done, and making someone do it.",
        steps: [
            { type: 'grammar', topic: 'Passive Voice', title: 'Grammar: Passive Voice: 이/히/리/기', level: 'Intermediate' },
            { type: 'grammar', topic: 'Causative Verbs', title: 'Grammar: Causative Verbs: 이/히/리/기/우/구/추', level: 'Intermediate' },
            { type: 'grammar', topic: 'Making Someone Do', title: 'Grammar: Making Someone Do: -게 하다', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Verb Pairs', title: 'Vocabulary: Common Passive and Causative Verb Pairs (자주 쓰는 피동사, 사동사 쌍)', level: 'Intermediate' },
            { type: 'reading_practice', topic: 'Comparing Active, Passive, and Causative Sentences', title: 'Reading: Comparing Sentences (능동, 피동, 사동 문장 비교)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 9: Assumptions & Social Commentary",
        module_description: "Learn how to express assumptions, general truths, and pretend actions.",
        steps: [
            { type: 'grammar', topic: 'Pretending', title: 'Grammar: Pretending: -(으)ㄴ/는 척하다', level: 'Intermediate' },
            { type: 'grammar', topic: "It's a Rule That...", title: "Grammar: It's a Rule That...: -(으)ㄴ/는 법이다", level: 'Intermediate' },
            { type: 'grammar', topic: 'No Point in Doing', title: 'Grammar: No Point in Doing: -(으)나 마나', level: 'Intermediate' },
            { type: 'grammar', topic: 'Let Alone', title: 'Grammar: Let Alone: -는/은커녕', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Social Issues', title: 'Vocabulary: Social Issues (환경 문제, 고령화 사회, 교육열)', level: 'Intermediate' },
            { type: 'reading_practice', topic: "South Korea's Efforts to Combat Plastic Waste", title: "Hot Issue: South Korea's Efforts to Combat Plastic Waste (한국의 플라스틱 쓰레기 문제 해결 노력)", level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 10: Expressing Appearance, Experience & Tendency",
        module_description: "Talk about how things look, past experiences, and personal tendencies.",
        steps: [
            { type: 'grammar', topic: 'Experience', title: 'Grammar: Experience: -(으)ㄴ 적이 있다/없다', level: 'Intermediate' },
            { type: 'grammar', topic: 'To Look/Seem', title: 'Grammar: To Look/Seem: -아/어 보이다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Assumptions', title: 'Grammar: Assumptions: -(으)ㄴ가 보다 & -(으)ㄹ 모양이다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Tend to Be...', title: 'Grammar: Tend to Be...: -는 편이다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Used to Do', title: 'Grammar: Used to Do: -곤 하다', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Health Terms', title: 'Vocabulary: Health & Hospital Terms (건강 및 병원 용어)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Hospital Visit', title: 'Dialogue: Hospital Visit (병원 방문)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 11: Regret, Hypotheticals & Mistaken Beliefs",
        module_description: "Talk about past regrets, hypothetical situations, and what you thought was true.",
        steps: [
            { type: 'grammar', topic: 'Should Have Done', title: 'Grammar: Should Have Done: -(으)ㄹ 걸 그랬다', level: 'Intermediate' },
            { type: 'grammar', topic: 'Almost Happened', title: 'Grammar: Almost Happened: -(으)ㄹ 뻔했다', level: 'Intermediate' },
            { type: 'grammar', topic: 'I Would Expect...', title: 'Grammar: I Would Expect...: -(으)ㄹ 텐데', level: 'Intermediate' },
            { type: 'grammar', topic: "I Thought/Didn't Know", title: "Grammar: I Thought/Didn't Know: -(으)ㄹ 줄 알았다/몰랐다", level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Decisions', title: 'Vocabulary: Decisions & Outcomes (결정과 결과)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Missed Opportunity', title: 'Dialogue: Missed Opportunity (과거의 실수나 놓친 기회에 대해 이야기하기)', level: 'Intermediate' },
        ]
    },
    {
        module_title: "Module 12: Culture, Hearsay & Realizations",
        module_description: "Deepen your cultural understanding by learning to share what you've heard and realized.",
        steps: [
            { type: 'grammar', topic: 'I Heard That...', title: 'Grammar: I Heard That...: -(ㄴ/는)다고 하던데', level: 'Intermediate' },
            { type: 'grammar', topic: 'Recalling a Past Observation', title: 'Grammar: Recalling a Past Observation: -더라(고요)', level: 'Intermediate' },
            { type: 'grammar', topic: 'Realization Through Action', title: 'Grammar: Realization Through Action: -다(가) 보니(까)', level: 'Intermediate' },
            { type: 'vocabulary', topic: 'Traditional Culture', title: 'Vocabulary: Traditional Culture (한복, 설날, 추석, 김치)', level: 'Intermediate' },
            { type: 'dialogue', topic: 'Holiday Plans', title: 'Dialogue: Korean Holiday Plans (한국 명절 계획 묻기)', level: 'Intermediate' },
            { type: 'reading_practice', topic: 'Chuseok', title: 'Reading: Chuseok (추석)', level: 'Intermediate' },
        ]
    }
];

// Predefined 12-module syllabus for Advanced
const advancedSyllabus: LearningModule[] = [
    {
        module_title: "Module 1: Abstract Concepts & Nuanced Expressions",
        module_description: "Learn to express abstract thoughts and nuanced feelings with advanced grammar.",
        steps: [
            { type: 'grammar', topic: 'Bound to Be', title: "Grammar: It's Bound to Be: -게 마련이다", level: 'Advanced' },
            { type: 'grammar', topic: 'It\'s Just That', title: "Grammar: It's Just That...: -(으)ㄹ 따름이다", level: 'Advanced' },
            { type: 'grammar', topic: 'To Be Extremely', title: "Grammar: To Be Extremely...: -기 짝이 없다", level: 'Advanced' },
            { type: 'grammar', topic: 'It is a Rule That', title: "Grammar: It Is a Rule That...: -(는/ㄴ) 법이다", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Abstract Nouns', title: "Vocabulary: Abstract Nouns: 추상, 개념, 현상, 본질, 가치", level: 'Advanced' },
            { type: 'reading_practice', topic: 'A Short Philosophical Essay on Happiness', title: "Reading: A Short Philosophical Essay on Happiness (현대 사회의 행복에 대한 짧은 철학적 에세이)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 2: Advanced Conditionals & Hypotheticals",
        module_description: "Master complex conditional and hypothetical grammar to discuss possibilities and regrets.",
        steps: [
            { type: 'grammar', topic: 'If... Had...', title: "Grammar: If... Had...: -았/었더라면", level: 'Advanced' },
            { type: 'grammar', topic: 'Even If... / I\'d Rather...', title: "Grammar: Even If... / I'd Rather...: -(으)ㄹ지언정", level: 'Advanced' },
            { type: 'grammar', topic: 'As Long As...', title: "Grammar: As Long As...: -(는) 한", level: 'Advanced' },
            { type: 'grammar', topic: 'Regardless Of', title: "Grammar: Regardless Of: -에 관계없이", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Possibilities and Consequences', title: "Vocabulary: Possibilities and Consequences: 가능성, 결과, 영향, 만약", level: 'Advanced' },
            { type: 'dialogue', topic: 'Career Path', title: "Dialogue: Discussing past regrets and future what-ifs about career (경력에 대한 과거의 후회와 미래의 가정에 대해 토론하기)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 3: Advanced Quoting & Citing Information",
        module_description: "Learn to quote, cite, and report information with nuance, essential for academic and professional contexts.",
        steps: [
            { type: 'grammar', topic: 'In the Sense That...', title: "Grammar: In the Sense That...: -(ㄴ/는)다는 점에서", level: 'Advanced' },
            { type: 'grammar', topic: 'Rather Than...', title: "Grammar: Rather Than...: -(ㄴ/는)다기보다는", level: 'Advanced' },
            { type: 'grammar', topic: 'According To...', title: "Grammar: According To...: -에 의하면 / -에 따르면", level: 'Advanced' },
            { type: 'grammar', topic: 'The Point is That...', title: "Grammar: The Point is That...: -(ㄴ/는)다는 것이다", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Academic & Research Terms', title: "Vocabulary: Academic and Research Terms: 연구, 분석, 결과, 주장, 근거", level: 'Advanced' },
            { type: 'reading_practice', topic: 'Analyzing an Academic Abstract', title: 'Reading: Analyzing an Academic Abstract (학술 초록 분석하기)', level: 'Advanced' }
        ]
    },
    {
        module_title: "Module 4: 사자성어 (Four-Character Idioms) & Proverbs",
        module_description: "Deepen cultural fluency by mastering common four-character idioms and proverbs.",
        steps: [
            { type: 'vocabulary', topic: 'Four-Character Idioms', title: "Vocabulary: 10 Common 사자성어", level: 'Advanced' },
            { type: 'grammar', topic: 'Idiom Usage', title: "Grammar: Integrating Idioms into Sentences (사자성어를 문장에 자연스럽게 통합하기)", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Korean Proverbs', title: "Vocabulary: 10 Common Korean Proverbs (자주 쓰는 한국 속담 10가지)", level: 'Advanced' },
            { type: 'dialogue', topic: 'Giving Advice', title: "Dialogue: A conversation using proverbs and idioms (속담과 사자성어를 사용한 대화)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 5: Discussing Social & Economic Issues",
        module_description: "Learn the grammar and vocabulary needed to discuss complex social and economic topics.",
        steps: [
            { type: 'grammar', topic: 'By Means Of...', title: "Grammar: By Means Of...: -(으)ㅁ으로써", level: 'Advanced' },
            { type: 'grammar', topic: 'To Be Nothing More Than', title: "Grammar: To Be Nothing More Than: -에 불과하다", level: 'Advanced' },
            { type: 'grammar', topic: 'There is a Concern That...', title: "Grammar: There is a Concern That...: -(으)ㄹ 우려가 있다", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Social Issues', title: "Vocabulary: Social Issues: 저출산, 고령화 사회, 취업난, 환경 오염", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Economic Terms', title: "Vocabulary: Economic Terms: 경제 성장, 물가 상승, 실업률, 투자", level: 'Advanced' },
            { type: 'reading_practice', topic: "An editorial on South Korea's low birth rate", title: "Reading: An editorial on South Korea's low birth rate (한국의 저출산에 대한 사설 읽기)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 6: Understanding News & Media Language",
        module_description: "Develop skills to understand the formal and objective language used in news articles and broadcasts.",
        steps: [
            { type: 'grammar', topic: 'Formal Declarative', title: "Grammar: Formal Declarative (Written) Style: -(ㄴ/는)다", level: 'Advanced' },
            { type: 'grammar', topic: 'Passive Voice in News', title: "Grammar: Passive Voice in News: -되다, -받다, -당하다", level: 'Advanced' },
            { type: 'vocabulary', topic: 'News Terms', title: "Vocabulary: News-related Terms: 보도, 발표, 공식 입장, 현장, 취재", level: 'Advanced' },
            { type: 'reading_practice', topic: 'A short news article', title: "Reading: A short news article (주요 한국 뉴스 웹사이트의 짧은 뉴스 기사)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 7: Business Korean 1 - Formal Communication",
        module_description: "Master formal language, including honorifics and humble forms, for professional settings.",
        steps: [
            { type: 'grammar', topic: 'Advanced Honorifics', title: "Grammar: Advanced Honorifics & Special Verbs: 고급 높임말과 특수 동사", level: 'Advanced' },
            { type: 'grammar', topic: 'Humble Forms', title: "Grammar: Humble Forms: 드리다, 뵙다, 여쭙다", level: 'Advanced' },
            { type: 'grammar', topic: 'Formal Writing Structure', title: "Grammar: Formal Email and Document Structure: 공식 이메일 및 문서 구조", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Business Vocabulary', title: "Vocabulary: Office & Business Vocabulary (회의, 보고서, 결재, 업무, 부서)", level: 'Advanced' },
            { type: 'dialogue', topic: 'Business Meeting', title: "Dialogue: Simulating a formal business meeting introduction (공식 비즈니스 미팅 소개 시뮬레이션)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 8: Business Korean 2 - Negotiations & Presentations",
        module_description: "Learn expressions for negotiation, persuasion, and delivering professional presentations.",
        steps: [
            { type: 'grammar', topic: 'Given That...', title: "Grammar: Given That...: -(으)니 만큼", level: 'Advanced' },
            { type: 'grammar', topic: 'With the Intention Of...', title: "Grammar: With the Intention Of...: -고자 하다", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Negotiation Terms', title: "Vocabulary: Negotiation and Contract Terms (협상, 계약, 제안, 조건, 마감일)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'A short business proposal document', title: "Reading: A short business proposal document (짧은 사업 제안서 문서)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 9: Slang, Neologisms & Modern Korean",
        module_description: "Stay current with the evolving Korean language by learning modern slang and newly coined words.",
        steps: [
            { type: 'grammar', topic: 'Slang Forms', title: "Grammar: Abbreviated Forms and Internet Slang (줄임말)", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Modern Slang', title: "Vocabulary: 10 Modern Slang & Neologisms (현대 속어 및 신조어 10가지)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'An online forum post about a trending topic among young Koreans', title: "Reading: An online forum post (젊은 한국인들 사이의 유행 토픽에 대한 온라인 포럼 게시물)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 10: Literary & Poetic Korean",
        module_description: "Appreciate the beauty of Korean literature by understanding its unique grammatical and vocabulary styles.",
        steps: [
            { type: 'grammar', topic: 'Poetic Forms', title: "Grammar: Poetic License and Archaic Forms (시적 허용과 고어 형태)", level: 'Advanced' },
            { type: 'vocabulary', topic: 'Literary Vocabulary', title: "Vocabulary: Descriptive and Emotional Adjectives & Adverbs (문학을 위한 묘사적, 감정적 형용사 및 부사)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'A short modern Korean poem with analysis', title: "Reading: A short modern Korean poem with analysis (분석이 포함된 짧은 현대 한국 시)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 11: Academic & TOPIK Writing Skills 1 (Introduction & Body)",
        module_description: "Learn how to structure and write effective introductions and body paragraphs for academic essays, focusing on TOPIK II.",
        steps: [
            { type: 'grammar', topic: 'Essay Structure', title: "Grammar: Structuring TOPIK Essays (TOPIK 에세이 구조화)", level: 'Advanced' },
            { type: 'grammar', topic: 'Formal Connectors', title: "Grammar: Formal Connectors for Argumentation (논증을 위한 공식 연결어)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'Analyzing a model TOPIK essay introduction', title: "Reading: Analyzing a model TOPIK essay introduction (모범 TOPIK 에세이 서론 분석)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'Pros and cons of social media', title: "Writing Practice: Pros and cons of social media (소셜 미디어의 장단점 글쓰기 연습)", level: 'Advanced' },
        ]
    },
    {
        module_title: "Module 12: Academic & TOPIK Writing Skills 2 (Conclusion & Advanced Endings)",
        module_description: "Master concluding paragraphs and advanced sentence endings to achieve a formal, academic tone in your writing.",
        steps: [
            { type: 'grammar', topic: 'Formal Statement', title: "Grammar: Formal Statement: -(는) 바이다", level: 'Advanced' },
            { type: 'grammar', topic: 'Considered That', title: "Grammar: It is Considered That...: -(으)로 사료된다", level: 'Advanced' },
            { type: 'grammar', topic: 'Writing Effective Concluding Paragraphs', title: "Grammar: Writing Effective Concluding Paragraphs (효과적인 결론 단락 쓰기)", level: 'Advanced' },
            { type: 'reading_practice', topic: 'The Importance of preserving traditional culture', title: "Writing Practice: Importance of preserving traditional culture (전통 문화 보존의 중요성에 대한 TOPIK 에세이 쓰기 연습)", level: 'Advanced' },
        ]
    }
];


export const learningPathData = {
    Beginner: beginnerSyllabus,
    Intermediate: intermediateSyllabus,
    Advanced: advancedSyllabus,
};
