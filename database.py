from dotenv import load_dotenv
load_dotenv()

from starter_app import app, db
from starter_app.models import User

with app.app_context():
  db.drop_all()
  db.create_all()

  ian = User(username = 'ian', email = 'ian@aa.io', password="password")
  javier = User(username = 'javier', email = 'javier@aa.io', password="password")
  dean = User(username = 'dean', email = 'dean@aa.io', password="password")
  angela = User(username = 'angela', email = 'angela@aa.io', password="password")
  soonmi = User(username = 'soon-mi', email = 'soonmi@aa.io', password="password")
  alissa = User(username = 'alissa', email = 'alissa@aa.io', password="password")

  db.session.add(ian)
  db.session.add(javier)
  db.session.add(dean)
  db.session.add(angela)
  db.session.add(soonmi)
  db.session.add(alissa)

  db.session.commit()