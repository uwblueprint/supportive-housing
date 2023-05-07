from ...models.team_members import TeamMembers
from ...models import db
from datetime import datetime
from sqlalchemy import select, cast, Date
import json

class TeamMembersService():
    """
    Residents implementation with residents management methods
    """

    def __init__(self, logger):
        """
        Create an instance of TeamMembersService
        
        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def to_json_list(self, team_member_results):
        try:
            team_members_list = []
            for team_member in team_member_results:
                team_members_list.append(
                    {
                       "id": team_member.id,
                       "first_name": team_member.first_name,
                       "last_name": team_member.last_name,
                       "role": team_member.role
                    }
                )
            return json.dumps(team_members_list)
        except Exception as postgres_error:
            raise postgres_error
        
    def add_team_member(self, member):
        new_member = member
        try:
            new_member = TeamMembers(**new_member)
            db.session.add(new_member)
            db.session.commit()
            return member
        except Exception as postgres_error:
            raise postgres_error
        
    
    def get_member(self, member_id=None):
        try:
            team_member_results = TeamMembers.query.all()
            return self.to_json_list(team_member_results)
        except Exception as postgres_error:
            raise postgres_error