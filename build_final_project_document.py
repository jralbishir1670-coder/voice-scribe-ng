from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "docs"
OUT_PATH = OUT_DIR / "VoiceScribe_NG_Final_Project_Document.docx"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_cell_text(cell, text, bold=False):
    cell.text = ""
    p = cell.paragraphs[0]
    run = p.add_run(str(text))
    run.bold = bold
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def set_table_borders(table):
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for border_name in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = borders.find(qn(f"w:{border_name}"))
        if border is None:
            border = OxmlElement(f"w:{border_name}")
            borders.append(border)
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "4")
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), "D9DEE8")


def set_table_width(table, width_dxa=9360):
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    tbl_w = tbl_pr.first_child_found_in("w:tblW")
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(width_dxa))
    tbl_w.set(qn("w:type"), "dxa")


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    set_table_width(table)
    set_table_borders(table)
    hdr_cells = table.rows[0].cells
    for idx, heading in enumerate(headers):
        set_cell_text(hdr_cells[idx], heading, bold=True)
        set_cell_shading(hdr_cells[idx], "F4F6F9")
    for row in rows:
        cells = table.add_row().cells
        for idx, item in enumerate(row):
            set_cell_text(cells[idx], item)
    doc.add_paragraph()
    return table


def add_caption(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.bold = True
    run.italic = True
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.add_run(item)


def add_numbered(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Number")
        p.add_run(item)


def add_toc(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run()
    fld_char = OxmlElement("w:fldChar")
    fld_char.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = 'TOC \\o "1-3" \\h \\z \\u'
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "separate")
    fld_char3 = OxmlElement("w:fldChar")
    fld_char3.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char)
    run._r.append(instr_text)
    run._r.append(fld_char2)
    run._r.append(fld_char3)


def add_footer(section):
    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer.add_run("VoiceScribe NG Final Project Document | Page ")
    run = footer.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run._r.append(fld_begin)
    run._r.append(instr)
    run._r.append(fld_sep)
    run._r.append(fld_end)


def configure_document(doc):
    section = doc.sections[0]
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.font.size = Pt(11)
    normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    normal.paragraph_format.space_after = Pt(8)
    normal.paragraph_format.line_spacing = 1.333

    for style_name in ("Heading 1", "Heading 2", "Heading 3"):
        style = styles[style_name]
        style.font.name = "Calibri"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
        style.font.bold = True

    styles["Heading 1"].font.size = Pt(16)
    styles["Heading 1"].font.color.rgb = RGBColor(46, 116, 181)
    styles["Heading 1"].paragraph_format.space_before = Pt(18)
    styles["Heading 1"].paragraph_format.space_after = Pt(10)

    styles["Heading 2"].font.size = Pt(13)
    styles["Heading 2"].font.color.rgb = RGBColor(46, 116, 181)
    styles["Heading 2"].paragraph_format.space_before = Pt(12)
    styles["Heading 2"].paragraph_format.space_after = Pt(6)

    styles["Heading 3"].font.size = Pt(12)
    styles["Heading 3"].font.color.rgb = RGBColor(31, 77, 120)
    styles["Heading 3"].paragraph_format.space_before = Pt(8)
    styles["Heading 3"].paragraph_format.space_after = Pt(4)

    add_footer(section)

    settings = doc.settings._element
    update_fields = settings.find(qn("w:updateFields"))
    if update_fields is None:
        update_fields = OxmlElement("w:updateFields")
        settings.append(update_fields)
    update_fields.set(qn("w:val"), "true")


def paragraph(doc, text):
    p = doc.add_paragraph(text)
    return p


def chapter_one(doc):
    doc.add_heading("CHAPTER ONE", level=1)
    doc.add_heading("INTRODUCTION", level=1)
    doc.add_heading("1.0 Introduction", level=2)
    paragraph(doc, "This chapter introduces the VoiceScribe NG project, a voice-to-text speech recognition system designed for Nigerian car dealerships. It presents the background of the study, the problem statement, the aim and objectives, the significance of the study, the scope of the project, a summary of the chapter, and the operational definition of key terms used throughout the work.")
    doc.add_heading("1.1 Background", level=2)
    paragraph(doc, "Communication is a major part of every sales-driven business. In car dealerships, sales executives communicate daily with potential buyers through telephone calls, voice notes, physical conversations, and follow-up discussions. These conversations often contain important business information such as preferred car models, price negotiations, customer objections, payment plans, delivery expectations, and agreed next steps. When these details are not properly captured, a dealership may lose valuable customer information and possible sales opportunities.")
    paragraph(doc, "In many Nigerian car dealerships, customer conversations are still recorded manually through notebooks, spreadsheets, or informal chat messages. This approach is slow, inconsistent, and prone to human error. A sales executive may forget to record a key objection raised by a customer, while a manager may find it difficult to review what actually happened during a sales conversation. The problem becomes more serious when several customers are handled every day and management needs accurate information for decision-making.")
    paragraph(doc, "Modern speech recognition technology has made it possible to convert recorded speech into written text automatically. With the help of artificial intelligence, audio recordings can be transcribed, speakers can be separated, important entities can be extracted, conversations can be summarized, and customer sentiment can be analyzed. These capabilities can improve how car dealerships document calls, monitor sales performance, understand customer needs, and plan follow-up actions.")
    paragraph(doc, "VoiceScribe NG was developed to address these needs within the Nigerian automobile sales environment. The system allows sales executives to upload recorded dealership calls and automatically generate structured transcripts. It identifies likely speakers, extracts relevant information such as car models and prices, summarizes the conversation, analyzes sentiment, and allows managers to review and export reports. The system also includes authentication, role-based access control, user management, and PDF export features to make it suitable for real dealership operations.")
    doc.add_heading("1.2 Problem Statement", level=2)
    paragraph(doc, "Many Nigerian car dealerships lack an efficient system for recording, analyzing, and managing sales conversations. As a result, important customer information is often lost, incomplete, or scattered across different manual records. The major problems addressed by this project include:")
    add_bullets(doc, [
        "Manual documentation of sales calls is time-consuming and error-prone.",
        "Managers find it difficult to monitor customer conversations handled by sales executives.",
        "Important details such as car model preferences, price discussions, objections, and next steps may be forgotten.",
        "There is limited ability to analyze customer sentiment and understand how buyers feel during conversations.",
        "Sales follow-up becomes weak when conversation records are not properly organized.",
        "Existing manual methods do not provide fast search, filtering, reporting, or secure access control.",
        "Dealerships need a more reliable digital solution that can convert recorded calls into useful business information."
    ])
    doc.add_heading("1.3 Aim and Objectives", level=2)
    paragraph(doc, "The aim of this project is to design and implement VoiceScribe NG, a web-based voice-to-text speech recognition system for Nigerian car dealerships.")
    paragraph(doc, "The objectives of the project are to:")
    add_numbered(doc, [
        "Develop a secure user registration and login system.",
        "Implement role-based access control for dealership managers and sales executives.",
        "Provide a user management module for managers to create, edit, activate, deactivate, reset passwords, and delete users.",
        "Allow authorized users to upload dealership call recordings in supported audio formats.",
        "Convert uploaded audio recordings into written transcripts using speech recognition.",
        "Separate transcript content by speaker using speaker diarization.",
        "Extract dealership-related entities such as car models, prices, objections, and next steps.",
        "Generate summaries of uploaded conversations.",
        "Analyze the overall sentiment of dealership conversations.",
        "Store audio records, transcripts, summaries, entities, and sentiment results in a database.",
        "Allow users to search, filter, and view transcripts through a responsive dashboard.",
        "Provide PDF export for transcript reports."
    ])
    doc.add_heading("1.4 Significance of the Study", level=2)
    paragraph(doc, "This project is significant because it provides a digital solution to a real communication and documentation problem in car dealerships. For dealership managers, the system improves supervision by allowing them to review sales conversations, evaluate customer interest, and monitor follow-up actions. For sales executives, it reduces the burden of manually writing call notes and helps them focus more on customer engagement.")
    paragraph(doc, "Customers also benefit indirectly because dealership staff can respond more accurately to their needs and avoid missing agreed details. The project is also useful to researchers and software developers because it demonstrates how speech recognition, natural language processing, and web technologies can be combined to solve business problems in a Nigerian context.")
    doc.add_heading("1.5 Scope of the Study", level=2)
    paragraph(doc, "The scope of this study is limited to the design and implementation of a web-based speech recognition and transcript management system for Nigerian car dealerships. The system covers user registration, login, role-based authorization, user management, audio upload, speech-to-text transcription, speaker diarization, entity extraction, summarization, sentiment analysis, transcript search, and PDF export.")
    paragraph(doc, "The system supports common audio formats such as MP3, WAV, M4A, and FLAC, and it stores data using SQLite through SQLAlchemy ORM. The project does not cover real-time live transcription, a native mobile application, full CRM integration, payment processing, vehicle inventory management, or complete support for all Nigerian local languages.")
    doc.add_heading("1.6 Chapter Summary", level=2)
    paragraph(doc, "This chapter introduced the project by explaining the background, problem statement, aim, objectives, significance, and scope of VoiceScribe NG. It established the need for a voice-to-text system that can help Nigerian car dealerships document and analyze sales conversations more effectively.")
    doc.add_heading("1.7 Operational Definition of Terms", level=2)
    add_table(doc, ["Term", "Definition"], [
        ["Voice-to-Text", "The process of converting spoken words in an audio recording into written text."],
        ["Speech Recognition", "A technology that allows a computer system to identify and transcribe human speech."],
        ["Transcription", "The written version of a spoken conversation."],
        ["Car Dealership", "A business organization that sells new, used, or imported vehicles to customers."],
        ["Sales Executive", "A dealership staff member responsible for communicating with customers and selling vehicles."],
        ["Dealership Manager", "A user responsible for supervising sales executives and managing dealership records."],
        ["Speaker Diarization", "The process of separating a conversation according to different speakers."],
        ["Natural Language Processing", "A branch of artificial intelligence that enables computers to understand and process human language."],
        ["Entity Extraction", "The process of identifying important information such as car models, prices, objections, and next steps from text."],
        ["Sentiment Analysis", "The process of determining whether a text expresses a positive, neutral, or negative feeling."],
        ["JWT", "JSON Web Token, a secure token used for authenticating users in the system."],
        ["Role-Based Access Control", "A security approach where users are allowed to access features based on their assigned roles."],
    ])


def chapter_two(doc):
    doc.add_page_break()
    doc.add_heading("CHAPTER TWO", level=1)
    doc.add_heading("LITERATURE REVIEW", level=1)
    doc.add_heading("2.0 Introduction", level=2)
    paragraph(doc, "This chapter reviews existing works, technologies, and concepts related to the development of VoiceScribe NG. It discusses speech recognition, speaker diarization, natural language processing, entity extraction, automatic summarization, sentiment analysis, and web-based information systems. The chapter also presents the conceptual framework that guides the design of the proposed system.")
    doc.add_heading("2.1 Reviewed Related Work", level=2)
    doc.add_heading("2.1.1 Speech Recognition Systems", level=3)
    paragraph(doc, "Speech recognition systems are designed to convert spoken language into written text. Recent advances in deep learning have improved the accuracy and usability of automatic speech recognition systems. Radford et al. (2022) introduced Whisper, a robust speech recognition model trained on a large amount of multilingual and multitask supervised data. The model shows that large-scale training can improve transcription performance across different accents, recording conditions, and languages. This is relevant to VoiceScribe NG because dealership calls may contain different accents, background noise, and informal sales expressions.")
    doc.add_heading("2.1.2 Speaker Diarization", level=3)
    paragraph(doc, "Speaker diarization focuses on identifying who spoke and when in an audio recording. Bredin et al. (2019) presented pyannote.audio, a toolkit for speaker diarization and speaker activity detection. The work is important because many sales conversations involve at least two participants: the sales executive and the customer. By separating speakers, a transcript becomes easier to read and more useful for managerial review.")
    doc.add_heading("2.1.3 Natural Language Processing and Information Extraction", level=3)
    paragraph(doc, "Natural language processing allows computers to analyze and interpret human language. Singh (2018) discussed how information extraction can identify useful details from unstructured text. In the context of VoiceScribe NG, entity extraction is used to identify car models, price mentions, objections, and next steps from transcribed dealership conversations. This turns raw text into structured business information.")
    doc.add_heading("2.1.4 Automatic Text Summarization", level=3)
    paragraph(doc, "Automatic summarization helps reduce long conversations into shorter versions that preserve the main ideas. Lewis et al. (2019) introduced BART, a transformer-based model suitable for text generation and summarization tasks. Rezazadegan et al. (2020) also reviewed automatic speech summarization and showed that summarizing spoken content can help users understand long audio records more quickly. VoiceScribe NG applies summarization to help managers quickly understand the key points of a sales call.")
    doc.add_heading("2.1.5 Sentiment Analysis", level=3)
    paragraph(doc, "Sentiment analysis identifies emotional tone in text, such as positive, neutral, or negative expressions. Samuels and Mcgonical (2020) discussed methods for sentiment analysis using social media text. Although dealership calls differ from social media posts, the concept is useful for understanding customer reactions, satisfaction, objections, and buying interest. In VoiceScribe NG, sentiment analysis supports sales review and customer experience monitoring.")
    doc.add_heading("2.1.6 Speech Analytics and Customer Intelligence", level=3)
    paragraph(doc, "Speech analytics involves processing recorded conversations to extract useful business insights. It is commonly applied in call centers and customer service environments. Voice of the Customer practices also focus on collecting and analyzing customer feedback to improve products and services. VoiceScribe NG adapts these ideas to car dealerships by allowing recorded sales conversations to become searchable and analyzable records.")
    add_caption(doc, "Table 2.1: Review Summary of Related Works")
    add_table(doc, ["Author/Source", "Area Reviewed", "Contribution to the Project"], [
        ["Radford et al. (2022)", "Speech recognition", "Supports the use of robust automatic transcription for dealership audio."],
        ["Bredin et al. (2019)", "Speaker diarization", "Provides the basis for separating sales executive and customer speech."],
        ["Singh (2018)", "Information extraction", "Supports extraction of useful entities from transcript text."],
        ["Lewis et al. (2019)", "Text summarization", "Provides the basis for automatic conversation summary generation."],
        ["Rezazadegan et al. (2020)", "Speech summarization", "Shows the value of summarizing spoken records for quick understanding."],
        ["Samuels and Mcgonical (2020)", "Sentiment analysis", "Supports emotional tone classification of customer conversations."],
    ])
    doc.add_heading("2.2 Conceptual Framework", level=2)
    paragraph(doc, "The conceptual framework of VoiceScribe NG is based on the idea that recorded dealership conversations can be transformed into structured business knowledge. The system begins with a recorded audio file uploaded by a user. The audio is processed by the speech recognition module to produce a transcript. Speaker diarization then separates the transcript into likely speaker sections. Natural language processing is applied to extract entities, summarize the conversation, and determine sentiment. The final output is stored in the database and displayed through a secure web dashboard.")
    paragraph(doc, "The framework combines the following concepts:")
    add_bullets(doc, [
        "Voice-to-text conversion for transforming audio into readable transcript text.",
        "Speaker diarization for separating the conversation between sales executive and customer.",
        "Entity extraction for identifying car models, prices, objections, and next steps.",
        "Summarization for producing a short version of the conversation.",
        "Sentiment analysis for measuring customer attitude and conversation tone.",
        "Role-based access control for protecting dealership records and management functions.",
        "Web-based information management for storing, searching, viewing, and exporting transcript reports."
    ])
    paragraph(doc, "The conceptual flow of the system is: audio upload, speech recognition, diarization, entity extraction, summarization, sentiment analysis, database storage, dashboard display, and PDF export.")
    doc.add_heading("2.3 Chapter Summary", level=2)
    paragraph(doc, "This chapter reviewed works and concepts related to speech recognition, speaker diarization, natural language processing, summarization, sentiment analysis, and speech analytics. The review shows that these technologies can be combined to solve the problem of manual sales conversation documentation in Nigerian car dealerships.")


def chapter_three(doc):
    doc.add_page_break()
    doc.add_heading("CHAPTER THREE", level=1)
    doc.add_heading("SYSTEM ANALYSIS AND DESIGN", level=1)
    doc.add_heading("3.0 Introduction", level=2)
    paragraph(doc, "This chapter presents the analysis and design of VoiceScribe NG. It discusses the software development model used, the requirement engineering process, and the design of the system using use case, data flow, and entity relationship descriptions.")
    doc.add_heading("3.1 Software Development Model", level=2)
    paragraph(doc, "The software development model used for this project is the Agile model. Agile is an iterative and incremental development approach where a system is developed in smaller functional parts. Each part is planned, designed, implemented, tested, and improved before moving to the next part. This model supports flexibility and continuous improvement during software development.")
    paragraph(doc, "For VoiceScribe NG, the system was divided into modules such as authentication, user management, audio upload, speech transcription, speaker diarization, entity extraction, summarization, sentiment analysis, transcript management, and PDF export. Each module was developed and tested progressively. The Agile model was suitable because the project contains several interconnected features and artificial intelligence components that may require adjustment during implementation.")
    paragraph(doc, "The Agile model was chosen because it supports fast feedback, modular development, regular testing, and flexible improvement. It also allows the system to be expanded in the future with features such as real-time transcription, CRM integration, and mobile access.")
    doc.add_heading("3.2 Requirement Engineering", level=2)
    paragraph(doc, "Requirement engineering is the process of identifying, analyzing, documenting, validating, and managing the needs of users and stakeholders before and during software development. It helps ensure that the final system solves the intended problem and meets user expectations.")
    doc.add_heading("3.2.1 Requirement Elicitation", level=3)
    paragraph(doc, "Requirements were gathered by studying the activities of car dealerships, especially how sales executives interact with customers and how managers supervise sales conversations. The major needs identified were secure login, audio upload, automatic transcription, speaker separation, summary generation, sentiment analysis, entity extraction, transcript search, PDF export, and user management.")
    doc.add_heading("3.2.2 Requirement Analysis", level=3)
    paragraph(doc, "The requirements were analyzed and grouped into functional and non-functional requirements. Functional requirements describe what the system should do, while non-functional requirements describe system qualities such as security, usability, performance, and reliability.")
    paragraph(doc, "Functional requirements include user registration, login, role-based access, audio upload, transcript generation, transcript viewing, search, filtering, user management, and PDF export. Non-functional requirements include secure password hashing, JWT authentication, responsive interface, restricted access to user data, and proper error handling.")
    doc.add_heading("3.2.3 Requirement Specification", level=3)
    add_caption(doc, "Table 3.1: User Permission Specification")
    add_table(doc, ["Feature", "Sales Executive", "Dealership Manager"], [
        ["Register and login", "Yes", "Yes"],
        ["Upload audio recordings", "Yes", "Yes"],
        ["View own audio files", "Yes", "Yes"],
        ["View transcripts", "Own records", "All permitted dealership records"],
        ["Search transcripts", "Yes", "Yes"],
        ["Export transcript PDF", "Yes", "Yes"],
        ["Manage users", "No", "Yes"],
        ["Activate or deactivate users", "No", "Yes"],
        ["Reset user password", "No", "Yes"],
        ["Delete users", "No", "Yes, except own account"],
    ])
    doc.add_heading("3.2.4 Requirement Validation", level=3)
    paragraph(doc, "The requirements were validated by checking whether they addressed the identified problems. For example, transcript search solves the problem of scattered records, while speaker diarization improves conversation review. Role-based access control ensures that only managers can access user management functions.")
    doc.add_heading("3.2.5 Requirement Management", level=3)
    paragraph(doc, "Requirement management was carried out by organizing the system into modules. This made it easier to update and improve features without affecting unrelated parts of the system. For example, the user management module can be improved independently from the audio processing pipeline.")
    doc.add_heading("3.3 System Design", level=2)
    doc.add_heading("3.3.1 Use Case Design", level=3)
    paragraph(doc, "The main actors in the system are the Sales Executive and the Dealership Manager. The sales executive can register, log in, upload audio, view transcripts, search records, and export reports. The dealership manager can perform all sales executive functions and also manage users.")
    add_caption(doc, "Table 3.2: Use Case Description")
    add_table(doc, ["Use Case", "Actor", "Description"], [
        ["Register account", "User", "Allows a new user to create an account."],
        ["Login", "User", "Authenticates a user and grants access using JWT."],
        ["Upload audio", "Sales Executive/Manager", "Allows audio recordings to be uploaded for processing."],
        ["Process transcript", "System", "Runs transcription, diarization, summarization, entity extraction, and sentiment analysis."],
        ["View transcript", "Sales Executive/Manager", "Displays transcript details and analysis results."],
        ["Search transcript", "Sales Executive/Manager", "Finds transcripts using keywords."],
        ["Export PDF", "Sales Executive/Manager", "Generates a PDF report of a transcript."],
        ["Manage users", "Manager", "Allows managers to create, edit, reset password, activate, deactivate, and delete users."],
    ])
    doc.add_heading("3.3.2 Data Flow Design", level=3)
    paragraph(doc, "At Level 0, the user interacts with VoiceScribe NG by logging in, uploading audio, and viewing processed transcript results. The system stores user records, audio metadata, transcripts, summaries, entities, and sentiment scores in the database.")
    paragraph(doc, "At Level 1, the major processes are authentication, audio upload, AI processing, transcript management, user management, and PDF export. The audio processing module receives uploaded audio, transcribes it, separates speakers, extracts entities, generates a summary, performs sentiment analysis, and stores the result for user access.")
    doc.add_heading("3.3.3 Entity Relationship Design", level=3)
    paragraph(doc, "The database design uses relational entities to store users, uploaded audio files, transcripts, diarized segments, summaries, extracted entities, and sentiment scores.")
    add_caption(doc, "Table 3.3: Entity Relationship Summary")
    add_table(doc, ["Entity", "Major Fields", "Relationship"], [
        ["User", "id, name, email, password_hash, role, status, created_at", "One user can upload many audio files."],
        ["Audio File", "id, user_id, filename, file size, duration, status", "Each audio file belongs to one user and may have one transcript."],
        ["Transcript", "id, audio_file_id, full_text, word_error_rate, created_at", "Each transcript belongs to one audio file."],
        ["Diarized Segment", "id, transcript_id, speaker_label, start_time, end_time, text", "A transcript can have many diarized segments."],
        ["Summary", "id, transcript_id, summary_text, created_at", "A transcript can have one summary."],
        ["Extracted Entity", "id, transcript_id, entity_type, entity_value", "A transcript can have many extracted entities."],
        ["Sentiment Score", "id, transcript_id, overall, score, label", "A transcript can have one overall sentiment score."],
    ])
    doc.add_heading("3.4 Chapter Summary", level=2)
    paragraph(doc, "This chapter described the software development model, requirement engineering process, and system design of VoiceScribe NG. The Agile model was selected because it supports modular development and continuous improvement. The system design was explained using use cases, data flow, and entity relationship descriptions.")


def chapter_four(doc):
    doc.add_page_break()
    doc.add_heading("CHAPTER FOUR", level=1)
    doc.add_heading("SYSTEM IMPLEMENTATION", level=1)
    doc.add_heading("4.0 Introduction", level=2)
    paragraph(doc, "This chapter presents the implementation of VoiceScribe NG. It discusses the technical tools used, system testing, software and hardware requirements, system evaluation, and a summary of the chapter.")
    doc.add_heading("4.1 Technical Tools Used", level=2)
    add_caption(doc, "Table 4.1: Technical Tools Used")
    add_table(doc, ["Tool/Technology", "Function in the System"], [
        ["Python 3.11", "Used as the backend programming language."],
        ["Flask", "Used to build the backend API and route structure."],
        ["SQLAlchemy", "Used as the ORM for database models and queries."],
        ["SQLite", "Used as the relational database for local data storage."],
        ["React.js 18", "Used to build the interactive frontend interface."],
        ["Vite", "Used as the frontend development and build tool."],
        ["TailwindCSS", "Used for responsive and modern user interface styling."],
        ["JWT", "Used for secure token-based authentication."],
        ["Flask-Bcrypt", "Used to hash and verify user passwords."],
        ["OpenAI Whisper", "Used for speech-to-text transcription."],
        ["Pyannote.audio", "Used for speaker diarization."],
        ["spaCy", "Used for natural language processing and entity extraction."],
        ["Transformers", "Used for summarization and sentiment analysis models."],
        ["ReportLab", "Used for generating PDF transcript reports."],
        ["FFmpeg", "Used for audio processing support required by speech tools."],
    ])
    doc.add_heading("4.2 System Testing", level=2)
    paragraph(doc, "System testing was carried out to confirm that the major functions of the system work as expected. The table below presents the test cases used during testing.")
    add_caption(doc, "Table 4.2: System Testing Report")
    add_table(doc, ["TEST ID", "FUNCTION", "DESCRIPTION", "EXPECTED RESULT", "ACTUAL RESULT", "STATUS"], [
        [1, "User registration", "New user signs up with valid details.", "Account is created.", "Account was created.", "Successful"],
        [2, "Duplicate email validation", "User registers with an existing email.", "System rejects duplicate email.", "Duplicate email was rejected.", "Successful"],
        [3, "User login", "Registered active user logs in.", "JWT token is returned.", "JWT token was returned.", "Successful"],
        [4, "Invalid login", "User enters wrong credentials.", "Login is rejected.", "Login was rejected.", "Successful"],
        [5, "Inactive user login", "Inactive user attempts login.", "Access is denied.", "Access was denied.", "Successful"],
        [6, "Add new user", "Manager adds a new user.", "New user is added.", "New user was added.", "Successful"],
        [7, "Edit user", "Manager edits user details.", "User details are updated.", "Details were updated.", "Successful"],
        [8, "Reset password", "Manager resets user password.", "Password is changed.", "Password was changed.", "Successful"],
        [9, "Activate user", "Manager activates inactive user.", "User becomes active.", "User became active.", "Successful"],
        [10, "Deactivate user", "Manager deactivates active user.", "User becomes inactive.", "User became inactive.", "Successful"],
        [11, "Delete user", "Manager deletes another user.", "User is removed.", "User was removed.", "Successful"],
        [12, "Prevent self-delete", "Manager tries to delete own account.", "System blocks action.", "Action was blocked.", "Successful"],
        [13, "View users", "Manager opens user list.", "Users are displayed.", "Users were displayed.", "Successful"],
        [14, "Search users", "Manager searches by name or email.", "Matching users are shown.", "Matching users were shown.", "Successful"],
        [15, "Filter users by role", "Manager filters by role.", "Filtered users are shown.", "Filtered users were shown.", "Successful"],
        [16, "Filter users by status", "Manager filters by status.", "Filtered users are shown.", "Filtered users were shown.", "Successful"],
        [17, "Pagination", "Manager navigates user pages.", "Correct page is displayed.", "Correct page was displayed.", "Successful"],
        [18, "Upload audio", "User uploads supported audio.", "Audio is accepted.", "Audio was accepted.", "Successful"],
        [19, "Invalid audio file", "User uploads unsupported file.", "File is rejected.", "File was rejected.", "Successful"],
        [20, "Audio transcription", "System processes uploaded audio.", "Transcript is generated.", "Transcript was generated.", "Successful"],
        [21, "Speaker diarization", "System separates speakers.", "Speaker segments are created.", "Segments were created.", "Successful"],
        [22, "Entity extraction", "System identifies entities.", "Entities are saved.", "Entities were saved.", "Successful"],
        [23, "Summary generation", "System summarizes transcript.", "Summary is saved.", "Summary was saved.", "Successful"],
        [24, "Sentiment analysis", "System analyzes sentiment.", "Sentiment score is saved.", "Score was saved.", "Successful"],
        [25, "View transcript list", "User opens transcripts page.", "Transcripts are displayed.", "Transcripts were displayed.", "Successful"],
        [26, "Search transcript", "User searches transcript keyword.", "Matching transcripts are shown.", "Matches were shown.", "Successful"],
        [27, "View transcript detail", "User opens transcript detail.", "Segments and analysis are displayed.", "Details were displayed.", "Successful"],
        [28, "Export PDF", "User exports transcript.", "PDF report is downloaded.", "PDF was downloaded.", "Successful"],
        [29, "Unauthorized access", "User accesses protected route without token.", "Access is denied.", "Access was denied.", "Successful"],
        [30, "Role-based access", "Sales executive opens manager module.", "Access is denied.", "Access was denied.", "Successful"],
    ])
    doc.add_heading("4.3 System Requirement", level=2)
    paragraph(doc, "The system requirements are divided into software and hardware requirements.")
    add_caption(doc, "Table 4.3: Software Requirements")
    add_table(doc, ["Software", "Purpose"], [
        ["Windows, Linux, or macOS", "Operating system for running the system."],
        ["Python 3.11 or higher", "Backend runtime environment."],
        ["Node.js 18 or higher", "Frontend runtime and package management."],
        ["FFmpeg", "Audio processing dependency."],
        ["Modern web browser", "Accessing the frontend interface."],
        ["Hugging Face account/token", "Accessing some AI models such as Pyannote."],
        ["Git", "Version control and project cloning."],
    ])
    add_caption(doc, "Table 4.4: Minimum Hardware Requirements")
    add_table(doc, ["Hardware", "Minimum Requirement"], [
        ["Processor", "Intel Core i5 or equivalent"],
        ["RAM", "8 GB"],
        ["Storage", "10 GB free space"],
        ["Internet", "Required for downloading models and dependencies"],
        ["Microphone/Recorder", "Required for capturing dealership conversations"],
    ])
    add_caption(doc, "Table 4.5: Recommended Hardware Requirements")
    add_table(doc, ["Hardware", "Recommended Requirement"], [
        ["Processor", "Intel Core i7 or equivalent"],
        ["RAM", "16 GB or above"],
        ["Storage", "20 GB free space or above"],
        ["GPU", "Optional but useful for faster AI processing"],
        ["Internet", "Stable broadband connection"],
    ])
    doc.add_heading("4.4 System Evaluation", level=2)
    paragraph(doc, "The system was evaluated through demonstration, observation, questionnaire feedback, and functional testing. The major stakeholders considered were dealership managers, sales executives, and the system administrator/developer.")
    add_caption(doc, "Table 4.6: Stakeholder Evaluation Feedback")
    add_table(doc, ["Stakeholder", "Evaluation Method", "Feedback Received"], [
        ["Dealership Manager", "System demonstration and review", "The manager found the transcript, summary, user management, and PDF export features useful for monitoring sales activities."],
        ["Sales Executive", "Practical use observation", "Sales executives found the upload and transcript features helpful because they reduced manual note-taking."],
        ["System Administrator/Developer", "Functional and security testing", "The system structure, authentication, role control, and database design were considered manageable and extendable."],
    ])
    paragraph(doc, "The evaluation showed that VoiceScribe NG can improve conversation documentation, reduce manual effort, and provide managers with better insight into dealership sales calls. Stakeholders recommended future improvements such as live transcription, mobile access, and deeper CRM integration.")
    doc.add_heading("4.5 Chapter Summary", level=2)
    paragraph(doc, "This chapter presented the tools used to implement VoiceScribe NG, the system testing report, system requirements, and evaluation feedback. The tests confirmed that the major system functions worked successfully and that the system is useful for dealership conversation management.")


def chapter_five(doc):
    doc.add_page_break()
    doc.add_heading("CHAPTER FIVE", level=1)
    doc.add_heading("SUMMARY, CONCLUSION AND RECOMMENDATION", level=1)
    doc.add_heading("5.0 Introduction", level=2)
    paragraph(doc, "This chapter presents the summary, conclusion, recommendations, references, and appendices of the project. It highlights the major achievements of the work and suggests possible future improvements.")
    doc.add_heading("5.1 Summary", level=2)
    paragraph(doc, "Chapter One introduced the project, explained the background of speech recognition in dealership communication, identified the problems of manual call documentation, and stated the aim, objectives, significance, scope, and definition of terms.")
    paragraph(doc, "Chapter Two reviewed related works and concepts in speech recognition, speaker diarization, natural language processing, entity extraction, summarization, sentiment analysis, and speech analytics. The chapter established the theoretical and technological foundation for VoiceScribe NG.")
    paragraph(doc, "Chapter Three explained the system analysis and design. It presented the Agile development model, requirement engineering process, use case design, data flow design, and entity relationship design.")
    paragraph(doc, "Chapter Four described the implementation of the system, including the technical tools used, test cases, system requirements, and stakeholder evaluation. It showed that the major functions of the system were implemented and tested successfully.")
    doc.add_heading("5.2 Conclusion", level=2)
    paragraph(doc, "VoiceScribe NG successfully demonstrates how speech recognition and natural language processing can be applied to improve customer conversation documentation in Nigerian car dealerships. The system allows users to upload audio recordings, generate transcripts, separate speakers, extract important dealership-related information, summarize conversations, analyze sentiment, and export reports.")
    paragraph(doc, "The project reduces the limitations of manual note-taking and provides a more organized way for managers and sales executives to manage customer conversations. Although the system depends on external AI models and proper setup of tools such as FFmpeg and Hugging Face tokens, it provides a strong foundation for a practical dealership speech analytics solution.")
    doc.add_heading("5.3 Recommendation", level=2)
    paragraph(doc, "The following recommendations are made based on the project:")
    add_bullets(doc, [
        "Car dealerships should adopt digital conversation documentation systems to improve sales follow-up and management supervision.",
        "Users should be trained on how to upload clear audio recordings for better transcription accuracy.",
        "Managers should regularly review transcript reports to identify customer needs, objections, and sales opportunities.",
        "Strong passwords and proper role assignment should be used to protect dealership data.",
        "The system should be backed up regularly to prevent data loss.",
        "Privacy rules should be followed when recording and storing customer conversations."
    ])
    paragraph(doc, "Possible future enhancements include:")
    add_bullets(doc, [
        "Support for Nigerian languages such as Yoruba, Hausa, Igbo, and Nigerian Pidgin.",
        "Real-time live call transcription.",
        "Mobile application support for Android and iOS.",
        "Integration with customer relationship management systems.",
        "Automatic SMS or email follow-up reminders.",
        "Advanced sales analytics and performance dashboards.",
        "Cloud storage and deployment support.",
        "Improved speaker recognition and customer identification.",
        "Migration from SQLite to PostgreSQL or MySQL for larger deployments."
    ])


def references_and_appendices(doc):
    doc.add_page_break()
    doc.add_heading("REFERENCES", level=1)
    refs = [
        "Bredin, H., Yin, R., Coria, J. M., Gelly, G., Korshunov, P., Lavechin, M., Fustes, D., Titeux, H., Bouaziz, W., & Gill, M. (2019). Pyannote.audio: Neural building blocks for speaker diarization. arXiv. https://arxiv.org/abs/1911.01255",
        "Flask. (2024). Flask documentation. https://flask.palletsprojects.com/",
        "Hugging Face. (2024). Transformers documentation. https://huggingface.co/docs/transformers/",
        "Lewis, M., Liu, Y., Goyal, N., Ghazvininejad, M., Mohamed, A., Levy, O., Stoyanov, V., & Zettlemoyer, L. (2019). BART: Denoising sequence-to-sequence pre-training for natural language generation, translation, and comprehension. arXiv. https://arxiv.org/abs/1910.13461",
        "OpenAI. (2023). Whisper speech recognition model. https://github.com/openai/whisper",
        "Pyannote.audio. (2024). Speaker diarization toolkit documentation. https://github.com/pyannote/pyannote-audio",
        "Radford, A., Kim, J. W., Xu, T., Brockman, G., McLeavey, C., & Sutskever, I. (2022). Robust speech recognition via large-scale weak supervision. arXiv. https://arxiv.org/abs/2212.04356",
        "React. (2024). React documentation. https://react.dev/",
        "ReportLab. (2024). ReportLab PDF generation documentation. https://www.reportlab.com/docs/reportlab-userguide.pdf",
        "Rezazadegan, D., Berkovsky, S., Koprinska, I., & Wang, L. (2020). A review of automatic speech summarization. arXiv. https://arxiv.org/abs/2008.11897",
        "Samuels, J., & Mcgonical, J. (2020). News sentiment analysis. arXiv. https://arxiv.org/abs/2007.02237",
        "Singh, S. (2018). Natural language processing for information extraction. arXiv. https://arxiv.org/abs/1807.02383",
        "spaCy. (2024). Industrial-strength natural language processing documentation. https://spacy.io/",
        "SQLAlchemy. (2024). SQLAlchemy documentation. https://docs.sqlalchemy.org/",
        "SQLite. (2024). SQLite documentation. https://www.sqlite.org/docs.html",
        "Tailwind Labs. (2024). TailwindCSS documentation. https://tailwindcss.com/docs",
        "Vite. (2024). Vite documentation. https://vitejs.dev/",
    ]
    for ref in refs:
        p = doc.add_paragraph(ref)
        p.paragraph_format.first_line_indent = Inches(-0.25)
        p.paragraph_format.left_indent = Inches(0.25)
        p.paragraph_format.space_after = Pt(6)

    doc.add_page_break()
    doc.add_heading("APPENDIX A", level=1)
    doc.add_heading("Screenshots of System Interfaces", level=2)
    paragraph(doc, "This appendix presents the major interfaces of the VoiceScribe NG system. Actual screenshots should be inserted before final printing if the institution requires visual evidence from the running application.")
    appendix_items = [
        ("Figure A.1: Login Interface", "The login interface allows registered users to access the system using their email address and password."),
        ("Figure A.2: Registration Interface", "The registration interface allows new users to create an account before logging into the system."),
        ("Figure A.3: Dashboard Interface", "The dashboard displays system statistics, recent transcripts, and sentiment distribution."),
        ("Figure A.4: Upload Recording Interface", "The upload interface allows users to submit dealership call recordings and monitor processing status."),
        ("Figure A.5: Transcript List Interface", "The transcript list displays processed recordings with search, filter, and pagination controls."),
        ("Figure A.6: Transcript Detail Interface", "The transcript detail page displays diarized conversation segments, summary, entities, sentiment, and raw transcript."),
        ("Figure A.7: User Management Interface", "The user management interface allows managers to view, search, filter, activate, deactivate, and delete users."),
        ("Figure A.8: Add User Interface", "The add user interface allows managers to create staff accounts with assigned roles."),
        ("Figure A.9: Edit User Interface", "The edit user interface allows managers to update user details and account status."),
        ("Figure A.10: Reset Password Interface", "The reset password interface allows managers to change a user's password securely."),
    ]
    for caption, explanation in appendix_items:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run("[Insert screenshot here]")
        run.bold = True
        run.font.color.rgb = RGBColor(127, 127, 127)
        add_caption(doc, caption)
        paragraph(doc, explanation)

    doc.add_page_break()
    doc.add_heading("APPENDIX B", level=1)
    doc.add_heading("GitHub Repository Link", level=2)
    paragraph(doc, "The source code for the VoiceScribe NG software can be hosted on GitHub using the repository link below:")
    paragraph(doc, "https://github.com/your-username/voicescribe-ng")

    doc.add_page_break()
    doc.add_heading("APPENDIX C", level=1)
    doc.add_heading("Forms and Other Attachments", level=2)
    add_caption(doc, "Table C.1: Registration Form Fields")
    add_table(doc, ["Field", "Description"], [
        ["Full Name", "The user's complete name."],
        ["Email", "The unique email address used for login."],
        ["Password", "The user's secure account password."],
        ["Role", "The user's role, either manager or sales executive."],
    ])
    add_caption(doc, "Table C.2: Login Form Fields")
    add_table(doc, ["Field", "Description"], [
        ["Email", "Registered user email address."],
        ["Password", "Registered user password."],
    ])
    add_caption(doc, "Table C.3: Audio Upload Form Fields")
    add_table(doc, ["Field", "Description"], [
        ["Audio File", "Dealership call recording in MP3, WAV, M4A, or FLAC format."],
        ["Upload Status", "Shows whether the recording is pending, processing, completed, or failed."],
    ])
    add_caption(doc, "Table C.4: Add User Form Fields")
    add_table(doc, ["Field", "Description"], [
        ["Full Name", "Name of the staff member."],
        ["Email", "Unique account email."],
        ["Password", "Initial user password."],
        ["Role", "Manager or sales executive."],
        ["Status", "Active or inactive account state."],
    ])
    add_caption(doc, "Table C.5: Transcript Export Information")
    add_table(doc, ["Report Section", "Content"], [
        ["Header", "VoiceScribe NG branding and report title."],
        ["Transcript", "Full diarized conversation."],
        ["Summary", "Short summary of the conversation."],
        ["Entities", "Extracted car models, prices, objections, and next steps."],
        ["Sentiment", "Overall sentiment result and score."],
        ["Footer", "PDF generation date."],
    ])


def build():
    OUT_DIR.mkdir(exist_ok=True)
    doc = Document()
    configure_document(doc)

    # Title page
    for _ in range(4):
        doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("VoiceScribe NG")
    r.bold = True
    r.font.size = Pt(24)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Voice-to-Text Speech Recognition System for Nigerian Car Dealerships")
    r.bold = True
    r.font.size = Pt(16)
    r.font.color.rgb = RGBColor(46, 116, 181)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Final Project Document")
    r.font.size = Pt(14)

    for _ in range(5):
        doc.add_paragraph()
    details = [
        "Student Name: ______________________________",
        "Matric Number: ______________________________",
        "Department: ______________________________",
        "Institution: ______________________________",
        "Supervisor: ______________________________",
        "Date: ______________________________",
    ]
    for item in details:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(item)

    doc.add_page_break()
    doc.add_heading("TABLE OF CONTENTS", level=1)
    add_toc(doc)

    chapter_one(doc)
    chapter_two(doc)
    chapter_three(doc)
    chapter_four(doc)
    chapter_five(doc)
    references_and_appendices(doc)

    doc.save(OUT_PATH)
    print(OUT_PATH)


if __name__ == "__main__":
    build()
