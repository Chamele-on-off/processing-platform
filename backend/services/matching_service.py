from models.transaction import Transaction
from models.triangle import TriangleTransaction
from extensions import db

class MatchingService:
    @staticmethod
    def find_and_create_matches():
        payouts = Transaction.get_pending_payouts()
        deposits = Transaction.get_pending_deposits()
        
        for payout in payouts:
            deposits = sorted(deposits, key=lambda x: x.amount)
            matched_deposits = []
            remaining = payout.amount
            
            for deposit in deposits:
                if deposit.amount <= remaining:
                    matched_deposits.append(deposit)
                    remaining -= deposit.amount
                    if remaining <= 0:
                        break
            
            if matched_deposits and remaining <= payout.amount * 0.1:
                triangle = TriangleTransaction.create(
                    payout_id=payout.id,
                    deposit_ids=[d.id for d in matched_deposits],
                    amount=payout.amount - remaining
                )
                
                payout.status = 'completed'
                for deposit in matched_deposits:
                    deposit.status = 'completed'
                
                db.session.commit()
                return triangle
        return None
