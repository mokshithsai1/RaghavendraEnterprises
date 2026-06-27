from werkzeug.security import generate_password_hash


def seed_data():
    from extensions import db
    from models import Category, Product, AdminUser

    if Category.query.first():
        return

    categories_data = [
        {"name": "Motor Starters", "slug": "motor-starters", "description": "DOL and star-delta motor starters for pumps and motors"},
        {"name": "Fuses", "slug": "fuses", "description": "HRC fuses, rewirable fuses, and fuse bases"},
        {"name": "Cables", "slug": "cables", "description": "Submersible, armoured, and flexible cables"},
        {"name": "Contactors", "slug": "contactors", "description": "AC contactors for motor and lighting control"},
        {"name": "Switches", "slug": "switches", "description": "Rotary isolators, changeover, and push button switches"},
        {"name": "Capacitors", "slug": "capacitors", "description": "Motor run and start capacitors for single-phase motors"},
        {"name": "Pumps", "slug": "pumps", "description": "Submersible and centrifugal pumps for irrigation"},
        {"name": "Electrical Accessories", "slug": "electrical-accessories", "description": "Terminal blocks, MCBs, indicators, and general accessories"},
    ]

    categories = {}
    for cat_data in categories_data:
        cat = Category(**cat_data)
        db.session.add(cat)
        db.session.flush()
        categories[cat.slug] = cat

    products_data = [
        {"name": "3 HP DOL Starter", "category": "motor-starters", "description": "Direct On-Line starter for 3 HP single phase motor with overload relay", "price": 850.00, "unit": "piece", "stock_quantity": 25, "min_stock_alert": 5, "godown_location": "A-1"},
        {"name": "5 HP Star Delta Starter", "category": "motor-starters", "description": "Star-delta automatic starter for 5 HP three phase motor", "price": 2200.00, "unit": "piece", "stock_quantity": 12, "min_stock_alert": 3, "godown_location": "A-2"},
        {"name": "7.5 HP DOL Starter", "category": "motor-starters", "description": "Heavy duty DOL starter suitable for 7.5 HP motor", "price": 1450.00, "unit": "piece", "stock_quantity": 8, "min_stock_alert": 3, "godown_location": "A-3"},
        {"name": "HRC Fuse 32A", "category": "fuses", "description": "High rupture capacity fuse cartridge 32 Amp", "price": 45.00, "unit": "piece", "stock_quantity": 100, "min_stock_alert": 20, "godown_location": "B-1"},
        {"name": "HRC Fuse 63A", "category": "fuses", "description": "High rupture capacity fuse cartridge 63 Amp", "price": 75.00, "unit": "piece", "stock_quantity": 80, "min_stock_alert": 20, "godown_location": "B-1"},
        {"name": "Fuse Base 32A", "category": "fuses", "description": "Porcelain fuse base unit for 32A rewirable fuse", "price": 35.00, "unit": "piece", "stock_quantity": 60, "min_stock_alert": 10, "godown_location": "B-2"},
        {"name": "Submersible Cable 1.5 sq mm (3 core)", "category": "cables", "description": "3 core submersible flat cable for borewell pumps, 1.5 sq mm", "price": 38.00, "unit": "meter", "stock_quantity": 500, "min_stock_alert": 50, "godown_location": "C-1"},
        {"name": "Submersible Cable 2.5 sq mm (3 core)", "category": "cables", "description": "3 core submersible flat cable, 2.5 sq mm for high-power pumps", "price": 58.00, "unit": "meter", "stock_quantity": 350, "min_stock_alert": 50, "godown_location": "C-1"},
        {"name": "Flexible Wire 1.5 sq mm", "category": "cables", "description": "Flexible copper wire, 1.5 sq mm, suitable for panel wiring", "price": 18.00, "unit": "meter", "stock_quantity": 800, "min_stock_alert": 100, "godown_location": "C-2"},
        {"name": "AC Contactor 16A", "category": "contactors", "description": "3 pole AC contactor, 16 Amp, 240V coil voltage", "price": 320.00, "unit": "piece", "stock_quantity": 30, "min_stock_alert": 5, "godown_location": "D-1"},
        {"name": "AC Contactor 32A", "category": "contactors", "description": "3 pole AC contactor, 32 Amp, 240V coil voltage", "price": 480.00, "unit": "piece", "stock_quantity": 20, "min_stock_alert": 5, "godown_location": "D-1"},
        {"name": "Rotary Isolator 32A (3 phase)", "category": "switches", "description": "3 phase rotary isolator switch, 32 Amp, panel mounting", "price": 280.00, "unit": "piece", "stock_quantity": 18, "min_stock_alert": 4, "godown_location": "E-1"},
        {"name": "Changeover Switch 32A", "category": "switches", "description": "Manual changeover switch for main/generator supply", "price": 650.00, "unit": "piece", "stock_quantity": 10, "min_stock_alert": 3, "godown_location": "E-2"},
        {"name": "Push Button Green NO", "category": "switches", "description": "Green push button, normally open, for start circuit", "price": 45.00, "unit": "piece", "stock_quantity": 75, "min_stock_alert": 10, "godown_location": "E-3"},
        {"name": "Capacitor 16 MFD", "category": "capacitors", "description": "Motor run capacitor, 16 MFD, 250V AC for single phase motor", "price": 120.00, "unit": "piece", "stock_quantity": 40, "min_stock_alert": 8, "godown_location": "F-1"},
        {"name": "Capacitor 25 MFD", "category": "capacitors", "description": "Motor run capacitor, 25 MFD, 250V AC", "price": 165.00, "unit": "piece", "stock_quantity": 35, "min_stock_alert": 8, "godown_location": "F-1"},
        {"name": "Capacitor 40 MFD", "category": "capacitors", "description": "Motor run capacitor, 40 MFD, 250V AC for higher HP motors", "price": 220.00, "unit": "piece", "stock_quantity": 4, "min_stock_alert": 8, "godown_location": "F-2"},
        {"name": "Submersible Pump 1 HP", "category": "pumps", "description": "1 HP single phase submersible pump for borewell, 25m head", "price": 4500.00, "unit": "piece", "stock_quantity": 6, "min_stock_alert": 2, "godown_location": "G-1"},
        {"name": "Submersible Pump 2 HP", "category": "pumps", "description": "2 HP single phase submersible pump, 35m head, with panel", "price": 7200.00, "unit": "piece", "stock_quantity": 4, "min_stock_alert": 2, "godown_location": "G-1"},
        {"name": "Centrifugal Pump 0.5 HP", "category": "pumps", "description": "0.5 HP self-priming centrifugal pump for surface irrigation", "price": 2800.00, "unit": "piece", "stock_quantity": 8, "min_stock_alert": 2, "godown_location": "G-2"},
        {"name": "MCB 16A Single Pole", "category": "electrical-accessories", "description": "16 Amp single pole miniature circuit breaker", "price": 85.00, "unit": "piece", "stock_quantity": 60, "min_stock_alert": 10, "godown_location": "H-1"},
        {"name": "MCB 32A Double Pole", "category": "electrical-accessories", "description": "32 Amp double pole MCB for main switch protection", "price": 185.00, "unit": "piece", "stock_quantity": 40, "min_stock_alert": 8, "godown_location": "H-1"},
        {"name": "Terminal Block 6 sq mm", "category": "electrical-accessories", "description": "Screw-type terminal block 6 sq mm, 600V, for panel wiring", "price": 22.00, "unit": "piece", "stock_quantity": 200, "min_stock_alert": 30, "godown_location": "H-2"},
        {"name": "Indicator Light Red 240V", "category": "electrical-accessories", "description": "Red LED indicator light for panel, 240V AC", "price": 28.00, "unit": "piece", "stock_quantity": 90, "min_stock_alert": 15, "godown_location": "H-3"},
    ]

    for prod_data in products_data:
        cat_slug = prod_data.pop("category")
        cat = categories.get(cat_slug)
        if cat:
            product = Product(category_id=cat.id, **prod_data)
            db.session.add(product)

    admin = AdminUser(
        username="Prasad",
        password_hash=generate_password_hash("Prasad@123"),
    )
    db.session.add(admin)

    db.session.commit()
    print("Database seeded successfully.")


def update_admin_credentials():
    from extensions import db
    from models import AdminUser
    admin = AdminUser.query.first()
    if admin:
        admin.username = "Prasad"
        admin.password_hash = generate_password_hash("Prasad@123")
        db.session.commit()
        print("Admin credentials updated.")
