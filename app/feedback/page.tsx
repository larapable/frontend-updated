"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Card, Modal } from "@mui/material";
import { useSession } from "next-auth/react";
import Navbar from '../components/Navbar';

type Feeling = 'HAPPY' | 'NEUTRAL' | 'SAD' | 'MAD';
type SatisfactionRating = 'VERY_SATISFIED' | 'SATISFIED' | 'NEUTRAL' | 'UNSATISFIED' | 'VERY_UNSATISFIED';
type SatisfactionAspect = 'friendliness' | 'knowledge' | 'quickness';

interface SatisfactionState {
  friendliness: SatisfactionRating | '';
  knowledge: SatisfactionRating | '';
  quickness: SatisfactionRating | '';
}

const FeedbackForm: React.FC = () => {
  const [feeling, setFeeling] = useState<Feeling | ''>('');
  const [satisfaction, setSatisfaction] = useState<SatisfactionState>({
    friendliness: '',
    knowledge: '',
    quickness: '',
  });
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCancelSave = () => {
    setShowModal(false);
  };

  const { data: session } = useSession();
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name);
  const department_id = user?.department_id;

  const formatRating = (rating: SatisfactionRating): string => {
    return rating.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSatisfactionChange = (aspect: SatisfactionAspect, value: SatisfactionRating) => {
    setSatisfaction(prev => ({ ...prev, [aspect]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!feeling) {
      setModalMessage('Please select how you are feeling.');
      setShowErrorModal(true);
      return;
    }
    if (!satisfaction.friendliness || !satisfaction.knowledge || !satisfaction.quickness) {
      setModalMessage('Please rate all aspects of satisfaction.');
      setShowErrorModal(true);
      return;
    }
    if (!feedback.trim()) {
      setModalMessage('Please provide overall feedback.');
      setShowErrorModal(true);
      return;
    }
    
    const feedbackData = {
      feeling: feeling.toUpperCase(),
      friendliness: satisfaction.friendliness,
      knowledge: satisfaction.knowledge,
      quickness: satisfaction.quickness,
      overallFeedback: feedback,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/feedback?departmentId=${department_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const result = await response.json();
      console.log('Feedback submitted successfully:', result);

      // Reset form fields and state
      setFeeling('');
      setSatisfaction({
        friendliness: '',
        knowledge: '',
        quickness: '',
      });
      setFeedback('');
      setShowModal(true);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      // alert('Failed to submit feedback. Please try again.');
      setModalMessage('Failed to submit feedback. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row w-full text-[rgb(59,59,59)]">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="mb-5 mt-[0rem] break-words font-bold text-[3rem]">
          FEEDBACK FORM
        </div>
        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
            We value your input! Let us know how you feel about using the app, rate different aspects of our service, and provide any additional comments. Your feedback is crucial in helping us improve and ensure that we meet your needs effectively. <span className='font-bold'>Thank you for taking the time to help us enhance your experience!</span>
        </div>
        
        <div className="flex justify-center items-center min-h-screen ml-[-5rem] p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl items-center">
            <div className="flex flex-col items-center justify-center">
            <div className='bg-[#A43214] w-[15rem] border border-none font-medium text-center rounded-lg px-2 py-2'>
                <p className='text-[1.1rem] text-white'>How are you feeling?</p>
            </div>
            <Card className="flex align-center rounded-lg border border-gray-200 justify-between py-5 px-2 bg-white h-[10rem] w-[50rem]">
                <div className="mb-6">
                    <div className="flex space-x-24 ml-7">
                    {[
                        { emoji: '😊', feeling: 'HAPPY' as Feeling },
                        { emoji: '😐', feeling: 'NEUTRAL' as Feeling },
                        { emoji: '😢', feeling: 'SAD' as Feeling },
                        { emoji: '😡', feeling: 'MAD' as Feeling }
                    ].map(({ emoji, feeling: feelingValue }) => (
                        <button
                        key={feelingValue}
                        type="button"
                        onClick={() => setFeeling(feelingValue)}
                        className={`p-2 border border-orange-200 rounded-full ${feeling === feelingValue ? 'bg-orange-200' : ''}`}
                        style={{ fontSize: '4rem' }}
                        >
                        {emoji}
                        </button>
                    ))}
                    </div>
                </div>
            </Card>
            </div>

            <div className="flex flex-col items-center justify-center">
            <div className='bg-[#A43214] mt-10 w-[20rem] border border-none font-medium text-center rounded-lg px-2 py-2'>
                <p className='text-[1.1rem] text-white'>Overall Satisfaction of Service</p>
            </div>
            <Card className="flex align-center rounded-lg border border-gray-200 justify-between bg-white h-[15rem] w-[50rem]">
            <table className="border-collapse text-[1rem] w-[50rem] align-center h-[15rem]">
              <thead>
                <tr>
                  <th className="border p-2">Aspect</th>
                  <th className="border p-2">Very Satisfied</th>
                  <th className="border p-2">Satisfied</th>
                  <th className="border p-2">Neutral</th>
                  <th className="border p-2">Unsatisfied</th>
                  <th className="border p-2">Very Unsatisfied</th>
                </tr>
              </thead>
              <tbody>
                {(['Friendliness', 'Knowledge', 'Quickness'] as const).map((aspect) => (
                  <tr key={aspect}>
                    <td className="border p-2 text-center">{aspect}</td>
                    {(['VERY_SATISFIED', 'SATISFIED', 'NEUTRAL', 'UNSATISFIED', 'VERY_UNSATISFIED'] as const).map((rating) => (
                      <td key={rating} className="border p-2 text-center">
                        <input
                          type="radio"
                          name={aspect}
                          value={rating}
                          onChange={() => handleSatisfactionChange(aspect.toLowerCase() as SatisfactionAspect, rating)}
                          checked={satisfaction[aspect.toLowerCase() as SatisfactionAspect] === rating}
                          style={{
                            opacity: 100,
                            width: '1.5rem',
                            height: '1.5rem',
                            cursor: 'pointer',
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </Card>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                <div className='bg-[#A43214] mt-10 w-[15rem] border border-none font-medium text-center rounded-lg px-2 py-2'>
                    <p className='text-[1.1rem] text-white'>Overall Feedback</p>
                </div>
                <Card className="flex align-center rounded-lg border border-gray-200 justify-between bg-white h-[15rem] w-[50rem]">
                    <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    value={feedback}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                    placeholder="Please provide your feedback here..."
                    ></textarea>
                </Card>
            </div>

            <div className="flex flex-col items-center justify-center">
            <button
                type="submit"
                className="rounded-[0.6rem] text-[#ffffff] font-bold text-lg py-2 px-3 w-[15rem] h-[fit-content] mb-10 mt-16 items-center"
                style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Now'}
            </button>
            </div>
            
        </form>
        </div>

        {/* Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
              <button
                onClick={handleCancelSave}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <p className="text-3xl font-bold mb-4">Success!</p>
              <p className="text-xl mb-4 mt-10">
                Your feedback has been submitted successfully.
              </p>
              <div className="flex justify-center gap-10 mt-12 mb-10">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-2 px-3 w-36 h-[fit-content]"
                  style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Error Modal */}
        <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
              <button
                onClick={handleCancelSave}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <p className="text-3xl font-bold mb-4">Notice!</p>
              <p className="text-xl mb-4 mt-10">
                {modalMessage}
              </p>
              <div className="flex justify-center gap-10 mt-12 mb-10">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="rounded-[0.6rem] text-[#ffffff] font-medium text-lg py-2 px-3 w-36 h-[fit-content]"
                  style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FeedbackForm;
