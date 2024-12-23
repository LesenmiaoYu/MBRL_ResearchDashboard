from app import db
from datetime import datetime

class MetaInfo(db.Model):
    __tablename__ = 'meta_info'

    id = db.Column(db.Integer, primary_key=True)
    goal_mkt = db.Column(db.Integer, default=2001)
    goal_mor = db.Column(db.Integer, default=2002)
    goal_comp = db.Column(db.Integer, default=2003)
    admin_id = db.Column(db.String(100), default='test_admin')
    admin_key = db.Column(db.String(100), default='test_key')

class PastProgress(db.Model):
    __tablename__ = 'past_progress'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    aggregate_mkt_hours = db.Column(db.Float, nullable=False)
    aggregate_mor_hours = db.Column(db.Float, nullable=False)
    aggregate_comp_hours = db.Column(db.Float, nullable=False)
