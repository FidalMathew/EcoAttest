from nada_dsl import *

def nada_main():

    party1 = Party(name="Party1")

    feedback1 = SecretInteger(Input(name="feedback1", party=party1))

    feedback2 = SecretInteger(Input(name="feedback2", party=party1))

    total_feedback = feedback1 + feedback2

    return [Output(total_feedback, "total_feedback", party1)]
